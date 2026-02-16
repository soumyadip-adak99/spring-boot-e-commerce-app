package com.shophub.ecommerce.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @SuppressWarnings("unchecked")
    public String uploadImage(MultipartFile file, String folder) throws IOException {
        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "folder", folder,
                        "resource_type", "auto"));
        String secureUrl = (String) uploadResult.get("secure_url");
        log.info("Image uploaded to Cloudinary: {}", secureUrl);
        return secureUrl;
    }

    public void deleteImage(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        log.info("Image deleted from Cloudinary: {}", publicId);
    }
}
