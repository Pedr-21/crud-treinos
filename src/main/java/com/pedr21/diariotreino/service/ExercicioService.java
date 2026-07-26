package com.pedr21.diariotreino.service;

import com.pedr21.diariotreino.model.Exercicio;
import com.pedr21.diariotreino.repository.ExercicioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExercicioService {

    private final ExercicioRepository exercicioRepository;

    public Exercicio criar(Exercicio exercicio) {
        return exercicioRepository.save(exercicio);
    }

    public List<Exercicio> listarTodos() {
        return exercicioRepository.findAll();
    }

    public Exercicio buscarPorId(Long id) {
        return exercicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercício não encontrado"));
    }

    public Exercicio atualizar(Long id, Exercicio dadosNovos) {
        Exercicio exercicio = buscarPorId(id);
        exercicio.setNome(dadosNovos.getNome());
        exercicio.setGrupoMuscular(dadosNovos.getGrupoMuscular());
        return exercicioRepository.save(exercicio);
    }

    public void deletar(Long id) {
        Exercicio exercicio = buscarPorId(id);
        exercicioRepository.delete(exercicio);
    }
}
