package com.library.library_management.service;

import com.library.library_management.dto.request.TypeCreationRequest;
import com.library.library_management.dto.request.TypeUpdateRequest;
import com.library.library_management.entity.Type;

import java.util.List;
import java.util.Optional;

public interface ITypeService {
    List<Type> getAllTypes();

    Optional<Type> getType(Integer typeId);

    Type createType(TypeCreationRequest request);

    Type updateType(Integer typeId,
                    TypeUpdateRequest request);

    void deleteType(Integer typeId,
                    String userId);
}
