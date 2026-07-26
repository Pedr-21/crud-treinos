package com.pedr21.diariotreino.repository;

import com.pedr21.diariotreino.model.Ficha;
import com.pedr21.diariotreino.model.FichaExercicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FichaExercicioRepository extends JpaRepository <FichaExercicio, Long> {
    List<FichaExercicio> findByFicha(Ficha ficha);
}
