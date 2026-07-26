package com.pedr21.diariotreino.controller;

import com.pedr21.diariotreino.model.Ficha;
import com.pedr21.diariotreino.service.FichaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fichas")
@RequiredArgsConstructor
public class FichaController {

    private final FichaService fichaService;

    @PostMapping
    public ResponseEntity<Ficha> criar(@Valid @RequestBody Ficha ficha) {
        return ResponseEntity.ok(fichaService.criar(ficha));
    }

    @GetMapping
    public ResponseEntity<List<Ficha>> listarMinhas() {
        return ResponseEntity.ok(fichaService.listarMinhas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ficha> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(fichaService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ficha> atualizar(@PathVariable Long id, @Valid @RequestBody Ficha ficha) {
        return ResponseEntity.ok(fichaService.atualizar(id, ficha));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        fichaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
