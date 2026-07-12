package com.library.library_management.service;

import com.library.library_management.dto.request.TypeCreationRequest;
import com.library.library_management.dto.request.TypeUpdateRequest;
import com.library.library_management.entity.Type;
import com.library.library_management.entity.User;
import com.library.library_management.repository.TypeRepository;
import com.library.library_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class TypeService implements ITypeService{

    @Autowired
    private TypeRepository typeRepository;

    @Autowired
    private UserRepository userRepository;

    private void checkAdminOrLibrarian(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        String roleName = user.getRole().getName();

        if (!roleName.equalsIgnoreCase("ADMIN") && !roleName.equalsIgnoreCase("LIBRARIAN")) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Bạn không có quyền thực hiện chức năng này");
        }
    }

    @Override
    public List<Type> getAllTypes() {
        List<Type> types = typeRepository.findAll();
        return types;
    }

    @Override
    public Optional<Type> getType(Integer typeId) {
        return typeRepository.findById(typeId);
    }

    @Override
    public Type createType(TypeCreationRequest request) {

        checkAdminOrLibrarian(request.getUserId());

        String name = request.getName();

        Type type = new Type(name);

        return typeRepository.save(type);

    }

    @Override
    public Type updateType(Integer typeId, TypeUpdateRequest request){
        checkAdminOrLibrarian(request.getUserId());
        Type type = typeRepository.findById(typeId)
                .orElseThrow(() -> new RuntimeException("Type not found"));

        type.setName(request.getName());

        return typeRepository.save(type);
    }

    @Override
    public void deleteType(Integer typeId, String userId){
        checkAdminOrLibrarian(userId);

        Type type = typeRepository.findById(typeId)
                .orElseThrow(() ->
                        new RuntimeException("Type not found"));

        typeRepository.delete(type);
    }


}
