package com.pedr21.diariotreino.service;

import com.pedr21.diariotreino.model.Exercicio;
import com.pedr21.diariotreino.model.Ficha;
import com.pedr21.diariotreino.model.FichaExercicio;
import com.pedr21.diariotreino.repository.ExercicioRepository;
import com.pedr21.diariotreino.repository.FichaExercicioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FichaExercicioService {

    private final FichaExercicioRepository fichaExercicioRepository;
    private final ExercicioRepository exercicioRepository;
    private final FichaService fichaService;

    public FichaExercicio adicionar(Long fichaId, Long exercicioId, Integer series, Integer repeticoes) {
        // buscarPorId já valida que a ficha pertence ao usuário logado
        Ficha ficha = fichaService.buscarPorId(fichaId);

        Exercicio exercicio = exercicioRepository.findById(exercicioId)
                .orElseThrow(() -> new RuntimeException("Exercício não encontrado"));

        FichaExercicio fichaExercicio = new FichaExercicio();
        fichaExercicio.setFicha(ficha);
        fichaExercicio.setExercicio(exercicio);
        fichaExercicio.setSeries(series);
        fichaExercicio.setRepeticoes(repeticoes);

        return fichaExercicioRepository.save(fichaExercicio);
    }

    public List<FichaExercicio> listarPorFicha(Long fichaId) {
        Ficha ficha = fichaService.buscarPorId(fichaId); // já valida que é do usuário logado
        return fichaExercicioRepository.findByFicha(ficha);
    }

    public void remover(Long id) {
        FichaExercicio fichaExercicio = fichaExercicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro não encontrado"));

        // valida que a ficha pertence ao usuário logado antes de deletar
        fichaService.buscarPorId(fichaExercicio.getFicha().getId());

        fichaExercicioRepository.delete(fichaExercicio);
    }
}
