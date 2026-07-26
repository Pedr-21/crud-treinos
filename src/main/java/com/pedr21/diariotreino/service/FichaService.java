package com.pedr21.diariotreino.service;

import com.pedr21.diariotreino.model.Ficha;
import com.pedr21.diariotreino.model.Usuario;
import com.pedr21.diariotreino.repository.FichaRepository;
import com.pedr21.diariotreino.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FichaService {

    private final FichaRepository fichaRepository;
    private final UsuarioRepository usuarioRepository;

    private Usuario getUsuarioLogado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public Ficha criar(Ficha ficha) {
        ficha.setUsuario(getUsuarioLogado());
        return fichaRepository.save(ficha);
    }

    public List<Ficha> listarMinhas() {
        return fichaRepository.findByUsuario(getUsuarioLogado());
    }

    public Ficha buscarPorId(Long id) {
        Ficha ficha = fichaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ficha não encontrada"));

        if (!ficha.getUsuario().getId().equals(getUsuarioLogado().getId())) {
            throw new RuntimeException("Acesso negado a essa ficha");
        }
        return ficha;
    }

    public Ficha atualizar(Long id, Ficha dadosNovos) {
        Ficha ficha = buscarPorId(id);
        ficha.setNome(dadosNovos.getNome());
        return fichaRepository.save(ficha);
    }

    public void deletar(Long id) {
        Ficha ficha = buscarPorId(id);
        fichaRepository.delete(ficha);
    }
}
