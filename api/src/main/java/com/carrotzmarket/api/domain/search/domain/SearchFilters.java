package com.carrotzmarket.api.domain.search.domain;

import com.carrotzmarket.api.domain.Address.Address;
import com.carrotzmarket.db.product.ProductStatus;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Data
@Slf4j
public class SearchFilters {
    private String search;
    private Integer categoryId;
    private String region;
    private String sort;
    private Integer minPrice;
    private Integer maxPrice;
    private ProductStatus onSale;
    private Address address;


    public void setCategory_id(String category_id) {
        log.info("setCategory_id 호출");
        if (category_id != null && !category_id.isEmpty()) {
            this.categoryId = Integer.parseInt(category_id);
        }
    }

    public void setSort_by(String sort_by) {
        log.info("setSort_by 호출");
        if (sort_by != null && !sort_by.isEmpty()) {
            this.sort = sort_by;
        }
    }

    public void setPrice(String price) {
        log.info("setPrice 호출");
        if (price != null && !price.isEmpty()) {
            String[] priceRange = price.split("__");
            this.minPrice = Integer.parseInt(priceRange[0]);
            this.maxPrice = Integer.parseInt(priceRange[1]);
        }
    }

    public void setOn_sale(String on_sale) {
        log.info("SetOnSale 호출");
        if (on_sale != null && !on_sale.isEmpty()) {
            this.onSale = ProductStatus.ON_SALE;
        }
    }

    public void setRegion(String region) {
        log.info("SetOnSale 호출");
            this.address = new Address();
        if (region != null && !region.isEmpty()) {
            String[] regions = region.split(" ");
            for (String re : regions) {
                if (re.endsWith("기") || re.endsWith("울")) {
                    this.address.setProvince(re);
                }

                if (re.endsWith("시")) {
                    this.address.setCity(re);
                }

                if (re.endsWith("구")) {
                    this.address.setTown(re);
                }

                if (re.endsWith("동")) {
                    this.address.setVillage(re);
                }
            }
        }
    }

}
