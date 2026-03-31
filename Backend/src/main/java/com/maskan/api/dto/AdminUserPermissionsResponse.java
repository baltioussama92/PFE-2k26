package com.maskan.api.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AdminUserPermissionsResponse {
    boolean canEditProfile;
    boolean canChangePassword;
    boolean canDeleteAccount;
    boolean canViewMessages;
    boolean canModerateListings;
}
