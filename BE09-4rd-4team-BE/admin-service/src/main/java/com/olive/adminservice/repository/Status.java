package com.olive.adminservice.repository;

public enum Status {
    SELLING("판매중"),
    SOLD_OUT("품절"),
    LOW_STOCK("품절임박");

    private final String displayName;

    Status(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

