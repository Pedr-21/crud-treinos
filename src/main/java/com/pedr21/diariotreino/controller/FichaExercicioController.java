package com.pedr21.diariotreino.controller;

import com.pedr21.diariotreino.model.FichaExercicio;
import com.pedr21.diariotreino.service.FichaExercicioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ficha-exercicios")
@RequiredArgsConstructor
public class FichaExercicioController {

    private final FichaExercicioService fichaExercicioService;

    @PostMapping
    public ResponseEntity<FichaExercicio> adicionar(
            @RequestParam Long fichaId,
            @RequestParam Long exercicioId,
            @RequestParam Integer series,
            @RequestParam Integer repeticoes
    ) {
        return ResponseEntity.ok(
                fichaExercicioService.adicionar(fichaId, exercicioId, series, repeticoes)
        );
    }

    @GetMapping
    public ResponseEntity<List<FichaExercicio>> listarPorFicha(@RequestParam Long fichaId) {
        return ResponseEntity.ok(fichaExercicioService.listarPorFicha(fichaId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        fichaExercicioService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
