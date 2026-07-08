package com.library.library_management.controller;

import com.library.library_management.dto.request.TypeCreationRequest;
import com.library.library_management.dto.request.TypeDeleteRequest;
import com.library.library_management.dto.request.TypeUpdateRequest;
import com.library.library_management.entity.Type;
import com.library.library_management.service.TypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequestMapping("/types")
@RestController
public class TypeController {
    @Autowired
    private TypeService typeService;

    @GetMapping("/")
    public List<Type> getAllTypes(){
        return typeService.getAllTypes();
    }

    @GetMapping("/{typeId}")
    public Optional<Type> getType(@PathVariable Integer typeId){
        return typeService.getType(typeId);
    }

    @PostMapping
    public Type createType(@RequestBody TypeCreationRequest request){
        return typeService.createType(request);
    }

    @PutMapping("/{typeId}")
    public Type updateType(@PathVariable Integer typeId,
                           @RequestBody TypeUpdateRequest request){
        return typeService.updateType(typeId,request);
    }

    @DeleteMapping("/{typeId}")
    public String deleteType(@PathVariable Integer typeId,
                             @RequestBody TypeDeleteRequest request){
        typeService.deleteType(typeId,request.getUserId());
        return "Type deleted";
    }
}
