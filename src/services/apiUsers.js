import supabase from "./supabase";

export async function getUsers() {
  const { data, error } = await supabase
    .from("users_view")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Users could not be loaded");
  }

  return data;
}

export async function deleteUser(id) {
  const { error } = await supabase.rpc("delete_user_by_id", {
    user_id: id,
  });

  if (error) {
    console.error(error);
    throw new Error("User could not be deleted");
  }
}

export async function updateUser({ id, email, fullName }) {
  const { error } = await supabase.rpc("update_user_by_id", {
    user_id: id,
    new_email: email,
    new_full_name: fullName,
  });

  if (error) {
    console.error(error);
    throw new Error("User could not be updated");
  }
}
