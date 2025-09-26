import type { UserListItem } from "~/features/users/types";

export function useUserFilters(users: Ref<UserListItem[]>) {
    const searchTermUser = ref('')
    const selectedRole = ref(null)
    const selectedStatus = ref(null)

    const filteredUsers = computed(() => {
        let filtered = users.value;

        if (selectedRole.value) {
            filtered = filtered.filter(user => user.roleCode === selectedRole.value);
        }

        if (selectedStatus.value !== null) {
            filtered = filtered.filter(user => user.isActive === selectedStatus.value);
        }

        if (searchTermUser.value.trim()) {
            const search = searchTermUser.value.toLowerCase().trim();
            filtered = filtered.filter(user =>
                user.code?.toLowerCase().includes(search) ||
                user.fullname?.toLowerCase().includes(search) ||
                user.email?.toLowerCase().includes(search) ||
                user.roleDescription?.toLowerCase().includes(search) ||
                user.statusDescription?.toLowerCase().includes(search)
            );
        }

        return filtered;
    })

    return { searchTermUser, selectedRole, selectedStatus, filteredUsers }
}