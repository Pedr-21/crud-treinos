package com.pedr21.diariotreino.service;

import com.pedr21.diariotreino.dto.UsuarioCadastroDTO;
import com.pedr21.diariotreino.dto.UsuarioRespostaDTO;
import com.pedr21.diariotreino.model.Usuario;
import com.pedr21.diariotreino.repository.UsuarioRepository;
import com.pedr21.diariotreino.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.pedr21.diariotreino.dto.UsuarioLoginDTO;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UsuarioRespostaDTO cadastrar(UsuarioCadastroDTO dto) {

        // 1. Verifica se o email já existe
        if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }

        // 2. Cria um novo Usuario, com a senha criptografada
        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));

        // 3. Salva no banco
        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        // 4. Devolve um DTO de resposta (sem senha)
        return new UsuarioRespostaDTO(
                usuarioSalvo.getId(),
                usuarioSalvo.getNome(),
                usuarioSalvo.getEmail()
        );
    }

    public String login(UsuarioLoginDTO dto) {

        // 1. Busca o usuário pelo email
        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou senha inválidos"));

        // 2. Compara a senha enviada com a senha criptografada no banco
        if (!passwordEncoder.matches(dto.getSenha(), usuario.getSenha())) {
            throw new RuntimeException("Email ou senha inválidos");
        }

        // 3. Se chegou até aqui, gera o token
        return jwtService.gerarToken(usuario.getEmail());
    }
}
