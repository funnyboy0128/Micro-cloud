package com.funnyboy.it.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;

@Entity
@Table(name = "T_DEMO")
public class Demo {

    @Id
    @Column(name = "ID",length = 36)
    private String id;

    @Column(name = "DEMO_CODE",length = 200)
    private String demoCode;

    @Column(name = "DEMO_NAME",length = 500)
    private String demoName;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDemoCode() {
        return demoCode;
    }

    public void setDemoCode(String demoCode) {
        this.demoCode = demoCode;
    }

    public String getDemoName() {
        return demoName;
    }

    public void setDemoName(String demoName) {
        this.demoName = demoName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Demo that = (Demo) o;
        return new EqualsBuilder()
                .append(demoCode, that.demoCode)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
                .append(demoCode)
                .toHashCode();
    }

    @Override
    public String toString() {
        return "Demo{" +
                "id='" + id + '\'' +
                ", demoCode='" + demoCode + '\'' +
                ", demoName='" + demoName + '\'' +
                '}';
    }
}
