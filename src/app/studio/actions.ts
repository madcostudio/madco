"use server";

import { cookies } from "next/headers";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import {
  encryptSession,
  decryptSession,
  hashPassword,
  verifyPassword,
  SessionData,
} from "@/lib/auth";
import crypto from "crypto";

// Ensure there is at least one owner seeded in Firestore
async function ensureOwnerSeeded() {
  try {
    const q = query(collection(db, "users"), where("role", "==", "admin"));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      const defaultUsername = process.env.OWNER_USERNAME || "owner";
      const defaultPassword = process.env.OWNER_PASSWORD || "madco@2026";
      
      const ownerId = "u_owner_" + crypto.randomBytes(4).toString("hex");
      const passwordHash = hashPassword(defaultPassword);
      
      await setDoc(doc(db, "users", ownerId), {
        id: ownerId,
        role: "admin",
        name: "Studio Owner",
        username: defaultUsername,
        passwordHash: passwordHash,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: "",
        forcePasswordChange: true, // Force change on first login
      });
      console.log(`[SEED] Created default owner account: "${defaultUsername}"`);
    }
  } catch (err) {
    console.error("[SEED] Error seeding default owner account:", err);
  }
}

/**
 * Retrieves the current session from the cookies.
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("madco_session")?.value;
  if (!token) return null;
  return decryptSession(token);
}

/**
 * Log in a user. Checks credentials and sets session cookie.
 */
export async function loginAction(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string; forcePasswordChange?: boolean }> {
  await ensureOwnerSeeded();

  if (!username || !password) {
    return { success: false, error: "Please enter both username and password." };
  }

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username.trim().toLowerCase()));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { success: false, error: "Invalid username or password." };
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    if (!userData.isActive) {
      return { success: false, error: "This account has been deactivated." };
    }

    const isMatch = verifyPassword(password, userData.passwordHash);
    if (!isMatch) {
      return { success: false, error: "Invalid username or password." };
    }

    // Set cookie
    const sessionData: SessionData = {
      userId: userData.id,
      username: userData.username,
      name: userData.name,
      role: userData.role,
    };

    const token = encryptSession(sessionData);
    const cookieStore = await cookies();
    cookieStore.set("madco_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Update last login
    await updateDoc(doc(db, "users", userData.id), {
      lastLoginAt: new Date().toISOString(),
    });

    return {
      success: true,
      forcePasswordChange: !!userData.forcePasswordChange,
    };
  } catch (err) {
    console.error("Login Action Error:", err);
    return { success: false, error: "An unexpected error occurred during login." };
  }
}

/**
 * Log out the current user.
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("madco_session");
  return { success: true };
}

/**
 * Changes password of the current user.
 */
export async function changePasswordAction(password: string): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Not authorized." };
  }

  if (!password || password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters long." };
  }

  try {
    const passwordHash = hashPassword(password);
    await updateDoc(doc(db, "users", session.userId), {
      passwordHash: passwordHash,
      forcePasswordChange: false,
    });
    return { success: true };
  } catch (err) {
    console.error("Change Password Action Error:", err);
    return { success: false, error: "Failed to update password." };
  }
}

/**
 * Creates a new crew member. (Admin Only)
 */
export async function addCrewAction(
  name: string
): Promise<{ success: boolean; error?: string; username?: string; password?: string }> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { success: false, error: "Access denied." };
  }

  if (!name || name.trim().length === 0) {
    return { success: false, error: "Please provide a valid crew name." };
  }

  try {
    const cleanName = name.trim();
    const baseUsername = cleanName.split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, "") || "crew";
    const randSuffix = Math.floor(10 + Math.random() * 89);
    const username = `${baseUsername}${randSuffix}`;

    // Verify uniqueness
    const qUnique = query(collection(db, "users"), where("username", "==", username));
    const uniqueSnap = await getDocs(qUnique);
    if (!uniqueSnap.empty) {
      return { success: false, error: "A generated username collision occurred. Please try again." };
    }

    // Generate readable random password
    const w1 = ["sky", "map", "lens", "frame", "north", "pano", "tour", "gold", "coast", "field"];
    const w2 = ["lens", "frame", "route", "point", "scan", "view", "path", "focus", "north", "map"];
    const password = `${w1[Math.floor(Math.random() * w1.length)]}-${
      w2[Math.floor(Math.random() * w2.length)]
    }-${Math.floor(100 + Math.random() * 899)}`;

    const crewId = "u_crew_" + crypto.randomBytes(4).toString("hex");
    const passwordHash = hashPassword(password);

    await setDoc(doc(db, "users", crewId), {
      id: crewId,
      role: "crew",
      name: cleanName,
      username,
      passwordHash,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: "",
      forcePasswordChange: true, // Force change on first login
    });

    return {
      success: true,
      username,
      password,
    };
  } catch (err) {
    console.error("Add Crew Action Error:", err);
    return { success: false, error: "Failed to create crew member." };
  }
}

/**
 * Toggles a crew member's active status. (Admin Only)
 */
export async function toggleCrewActiveAction(
  crewId: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { success: false, error: "Access denied." };
  }

  try {
    await updateDoc(doc(db, "users", crewId), { isActive });
    return { success: true };
  } catch (err) {
    console.error("Toggle Crew Active Error:", err);
    return { success: false, error: "Failed to update crew status." };
  }
}

/**
 * Deletes a crew member. (Admin Only)
 * Unassigns all clients assigned to them.
 */
export async function deleteCrewAction(crewId: string): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { success: false, error: "Access denied." };
  }

  try {
    await deleteDoc(doc(db, "users", crewId));

    // Unassign clients
    const clientsRef = collection(db, "clients");
    const q = query(clientsRef, where("assignedTo", "==", crewId));
    const snapshot = await getDocs(q);

    for (const d of snapshot.docs) {
      await updateDoc(doc(db, "clients", d.id), { assignedTo: null });
    }

    return { success: true };
  } catch (err) {
    console.error("Delete Crew Error:", err);
    return { success: false, error: "Failed to delete crew member." };
  }
}

/**
 * Creates a new client job. (Admin Only)
 */
export async function addClientAction(
  businessName: string,
  contactName: string,
  phone: string,
  area: string,
  packageKey: string,
  assignedTo: string | null,
  notes: string
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { success: false, error: "Access denied." };
  }

  if (!businessName || !contactName || !phone || !area || !packageKey) {
    return { success: false, error: "Please fill in all required fields." };
  }

  try {
    const clientId = "c_" + crypto.randomBytes(6).toString("hex");

    await setDoc(doc(db, "clients", clientId), {
      id: clientId,
      businessName: businessName.trim(),
      contactName: contactName.trim(),
      phone: phone.trim(),
      area: area.trim(),
      package: packageKey,
      assignedTo: assignedTo || null,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      progress: {},
    });

    return { success: true };
  } catch (err) {
    console.error("Add Client Error:", err);
    return { success: false, error: "Failed to create client." };
  }
}

/**
 * Updates a client job detail or assignment. (Admin Only)
 */
export async function updateClientAction(
  clientId: string,
  businessName: string,
  contactName: string,
  phone: string,
  area: string,
  packageKey: string,
  assignedTo: string | null,
  notes: string
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { success: false, error: "Access denied." };
  }

  try {
    await updateDoc(doc(db, "clients", clientId), {
      businessName: businessName.trim(),
      contactName: contactName.trim(),
      phone: phone.trim(),
      area: area.trim(),
      package: packageKey,
      assignedTo: assignedTo || null,
      notes: notes.trim(),
    });
    return { success: true };
  } catch (err) {
    console.error("Update Client Error:", err);
    return { success: false, error: "Failed to update client." };
  }
}

/**
 * Assigns a client to a crew member directly. (Admin Only)
 */
export async function assignClientAction(
  clientId: string,
  assignedTo: string | null
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { success: false, error: "Access denied." };
  }

  try {
    await updateDoc(doc(db, "clients", clientId), {
      assignedTo: assignedTo || null,
    });
    return { success: true };
  } catch (err) {
    console.error("Assign Client Error:", err);
    return { success: false, error: "Failed to assign crew member." };
  }
}

/**
 * Deletes a client. (Admin Only)
 */
export async function deleteClientAction(clientId: string): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { success: false, error: "Access denied." };
  }

  try {
    await deleteDoc(doc(db, "clients", clientId));
    return { success: true };
  } catch (err) {
    console.error("Delete Client Error:", err);
    return { success: false, error: "Failed to delete client." };
  }
}

/**
 * Toggles a checklist step completed status. (Admin & Assigned Crew Only)
 */
export async function toggleChecklistStepAction(
  clientId: string,
  stepId: string,
  isCompleted: boolean
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Not authorized." };
  }

  try {
    const clientRef = doc(db, "clients", clientId);
    const clientSnap = await getDoc(clientRef);

    if (!clientSnap.exists()) {
      return { success: false, error: "Client not found." };
    }

    const clientData = clientSnap.data();

    // Check authorization: Admin or assigned Crew
    if (session.role !== "admin" && clientData.assignedTo !== session.userId) {
      return { success: false, error: "You are not authorized to update this client." };
    }

    const progress = clientData.progress || {};
    if (isCompleted) {
      progress[stepId] = true;
    } else {
      delete progress[stepId];
    }

    await updateDoc(clientRef, { progress });
    return { success: true };
  } catch (err) {
    console.error("Toggle Step Error:", err);
    return { success: false, error: "Failed to update progress." };
  }
}

/**
 * Retrieves all clients. Admins see all. Crew see only assigned clients.
 */
export async function getClientsAction(): Promise<{ success: boolean; clients?: any[]; error?: string }> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Not authorized." };
  }

  try {
    const clientsRef = collection(db, "clients");
    let q;
    if (session.role === "admin") {
      q = query(clientsRef);
    } else {
      q = query(clientsRef, where("assignedTo", "==", session.userId));
    }

    const snapshot = await getDocs(q);
    const clients = snapshot.docs.map((d) => d.data()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return { success: true, clients };
  } catch (err) {
    console.error("Get Clients Error:", err);
    return { success: false, error: "Failed to fetch clients." };
  }
}

/**
 * Retrieves all crew accounts. (Admin Only)
 */
export async function getCrewAction(): Promise<{ success: boolean; crew?: any[]; error?: string }> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { success: false, error: "Access denied." };
  }

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "==", "crew"));
    const snapshot = await getDocs(q);
    const crew = snapshot.docs.map((d) => {
      const data = d.data();
      // Remove password hash from payload sent to UI for security
      const { passwordHash, ...rest } = data;
      return rest;
    });
    return { success: true, crew };
  } catch (err) {
    console.error("Get Crew Error:", err);
    return { success: false, error: "Failed to fetch crew logins." };
  }
}

/**
 * Retrieves stats for the admin overview dashboard. (Admin Only)
 */
export async function getOverviewStatsAction(): Promise<{
  success: boolean;
  stats?: {
    crewCount: number;
    activeClients: number;
    inProgressCount: number;
    completedCount: number;
  };
  error?: string;
}> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { success: false, error: "Access denied." };
  }

  try {
    const usersRef = collection(db, "users");
    const crewQ = query(usersRef, where("role", "==", "crew"));
    const crewSnap = await getDocs(crewQ);
    const crewCount = crewSnap.size;

    const clientsRef = collection(db, "clients");
    const clientsSnap = await getDocs(query(clientsRef));
    const activeClients = clientsSnap.size;

    let inProgressCount = 0;
    let completedCount = 0;

    clientsSnap.docs.forEach((doc) => {
      const data = doc.data();
      const progress = data.progress || {};
      const completedSteps = Object.keys(progress).length;
      
      // Calculate total steps based on package
      const packageKey = data.package;
      // We will count dynamically:
      const { allItemIds } = require("@/lib/checklist");
      const totalSteps = allItemIds(packageKey).length;

      if (completedSteps === totalSteps && totalSteps > 0) {
        completedCount++;
      } else if (completedSteps > 0) {
        inProgressCount++;
      }
    });

    return {
      success: true,
      stats: {
        crewCount,
        activeClients,
        inProgressCount,
        completedCount,
      },
    };
  } catch (err) {
    console.error("Get Overview Stats Error:", err);
    return { success: false, error: "Failed to fetch overview metrics." };
  }
}

/**
 * Retrieves recent public booking inquiries. (Admin Only)
 */
export async function getBookingsAction(): Promise<{ success: boolean; bookings?: any[]; error?: string }> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { success: false, error: "Access denied." };
  }

  try {
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef);
    const snapshot = await getDocs(q);
    
    const bookings = snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((b: any) => !b.type)
      .sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt));
      
    return { success: true, bookings };
  } catch (err) {
    console.error("Get Bookings Error:", err);
    return { success: false, error: "Failed to fetch bookings." };
  }
}
