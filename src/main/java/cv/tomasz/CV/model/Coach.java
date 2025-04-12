package cv.tomasz.CV.model;

import java.util.UUID;

/**
 * Model representing a coach entity in the application
 */
public class Coach {
    private String id;
    private String name;
    private String type;
    private String description;
    private String avatar;
    private String createdAt;

    public Coach() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = java.time.LocalDateTime.now().toString();
    }

    public Coach(String name, String type, String description, String avatar) {
        this();
        this.name = name;
        this.type = type;
        this.description = description;
        this.avatar = avatar;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
} 