package com.pedr21.diariotreino.controller;

import com.pedr21.diariotreino.model.Exercicio;
import com.pedr21.diariotreino.service.ExercicioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exercicios")
@RequiredArgsConstructor
public class ExercicioController {

    private final ExercicioService exercicioService;

    @PostMapping
    public ResponseEntity<Exercicio> criar(@Valid @RequestBody Exercicio exercicio) {
        return ResponseEntity.ok(exercicioService.criar(exercicio));
    }

    @GetMapping
    public ResponseEntity<List<Exercicio>> listarTodos() {
        return ResponseEntity.ok(exercicioService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exercicio> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(exercicioService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exercicio> atualizar(@PathVariable Long id, @Valid @RequestBody Exercicio exercicio) {
        return ResponseEntity.ok(exercicioService.atualizar(id, exercicio));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        exercicioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}