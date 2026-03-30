package com.maskan.api.security;

import com.maskan.api.entity.User;
import com.maskan.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<SimpleGrantedAuthority> authorities = new ArrayList<>(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );

        if ("HOST".equals(user.getRole().name())) {
            authorities.add(new SimpleGrantedAuthority("ROLE_PROPRIETOR"));
        }
        if ("GUEST".equals(user.getRole().name())) {
            authorities.add(new SimpleGrantedAuthority("ROLE_TENANT"));
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(authorities)
            .disabled(Boolean.TRUE.equals(user.getBanned()))
                .build();
    }
}

