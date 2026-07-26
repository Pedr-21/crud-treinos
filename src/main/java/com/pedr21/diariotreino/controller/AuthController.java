package com.pedr21.diariotreino.controller;

import com.pedr21.diariotreino.dto.UsuarioCadastroDTO;
import com.pedr21.diariotreino.dto.UsuarioLoginDTO;
import com.pedr21.diariotreino.dto.UsuarioRespostaDTO;
import com.pedr21.diariotreino.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioService usuarioService;

    @PostMapping("/cadastro")
    public ResponseEntity<UsuarioRespostaDTO> cadastrar(@Valid @RequestBody UsuarioCadastroDTO dto) {
        UsuarioRespostaDTO resposta = usuarioService.cadastrar(dto);
        return ResponseEntity.ok(resposta);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody UsuarioLoginDTO dto) {
        String token = usuarioService.login(dto);
        return ResponseEntity.ok(token);
    }
}