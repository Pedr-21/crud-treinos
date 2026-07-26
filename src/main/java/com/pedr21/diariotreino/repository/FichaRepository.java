package com.pedr21.diariotreino.repository;

import com.pedr21.diariotreino.model.Ficha;
import com.pedr21.diariotreino.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FichaRepository extends JpaRepository<Ficha, Long> {

    List<Ficha> findByUsuario (Usuario usuario);
}
