package com.maskan.api.dto;

import com.maskan.api.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingStatusUpdateRequest {
    @NotNull
    private BookingStatus status;
}

