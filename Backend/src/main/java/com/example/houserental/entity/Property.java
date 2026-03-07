package com.example.houserental.entity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "properties")
public class Property {

    @Id
    private String id;

    @NotBlank
    private String title;

    @NotBlank
    private String location;

    @NotNull
    private BigDecimal price;

    @DBRef(lazy = true)
    private User owner;

    @Builder.Default
    @DBRef(lazy = true)
    private List<Booking> bookings = new ArrayList<>();

    @Builder.Default
    @DBRef(lazy = true)
    private List<Review> reviews = new ArrayList<>();
}
