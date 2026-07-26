package com.pedr21.diariotreino.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UsuarioLoginDTO {
    @NotBlank
    private String email;

    @NotBlank
    private String senha;
}
