package com.pedr21.diariotreino.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioRespostaDTO {

    private  Long id;

    private String nome;

    private String email;
}
