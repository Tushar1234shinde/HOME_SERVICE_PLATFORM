package com.freelance.marketplace.repository;

import com.freelance.marketplace.entity.ServiceGig;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;

public class GigSpecification {

    public static Specification<ServiceGig> filterGigs(String category, BigDecimal minPrice, BigDecimal maxPrice) {
        return Specification.where(hasCategory(category))
                .and(hasPriceGreaterThanOrEqualTo(minPrice))
                .and(hasPriceLessThanOrEqualTo(maxPrice));
    }

    private static Specification<ServiceGig> hasCategory(String category) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(category)) {
                return null;
            }
            return cb.equal(cb.lower(root.get("category")), category.toLowerCase());
        };
    }

    private static Specification<ServiceGig> hasPriceGreaterThanOrEqualTo(BigDecimal minPrice) {
        return (root, query, cb) -> {
            if (minPrice == null) {
                return null;
            }
            return cb.greaterThanOrEqualTo(root.get("price"), minPrice);
        };
    }

    private static Specification<ServiceGig> hasPriceLessThanOrEqualTo(BigDecimal maxPrice) {
        return (root, query, cb) -> {
            if (maxPrice == null) {
                return null;
            }
            return cb.lessThanOrEqualTo(root.get("price"), maxPrice);
        };
    }
}
