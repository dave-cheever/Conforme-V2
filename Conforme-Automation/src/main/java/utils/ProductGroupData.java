// src/main/java/data/ProductGroupData.java
package utils;

public class ProductGroupData {
    private final String company;
    private final String section;
    private final String type;
    private final String description;
    private final String notes;
    private final String additionalNotes;
    private final String identifier;
    private final String certNumber;
    private final String standards;
    private final String layout;
    private final String filePath;

    private ProductGroupData(Builder b) {
        this.company         = b.company;
        this.section         = b.section;
        this.type            = b.type;
        this.description     = b.description;
        this.notes           = b.notes;
        this.additionalNotes = b.additionalNotes;
        this.identifier      = b.identifier;
        this.certNumber      = b.certNumber;
        this.standards       = b.standards;
        this.layout          = b.layout;
        this.filePath        = b.filePath;
    }

    public String getCompany()         { return company; }
    public String getSection()         { return section; }
    public String getType()            { return type; }
    public String getDescription()     { return description; }
    public String getNotes()           { return notes; }
    public String getAdditionalNotes() { return additionalNotes; }
    public String getIdentifier()      { return identifier; }
    public String getCertNumber()      { return certNumber; }
    public String getStandards()       { return standards; }
    public String getLayout()          { return layout; }
    public String getFilePath()        { return filePath; }

    public static class Builder {
        private String company;
        private String section;
        private String type;
        private String description;
        private String notes;
        private String additionalNotes;
        private String identifier;
        private String certNumber;
        private String standards;
        private String layout;
        private String filePath;

        public Builder company(String c)           { this.company = c; return this; }
        public Builder section(String s)           { this.section = s; return this; }
        public Builder type(String t)              { this.type = t; return this; }
        public Builder description(String d)       { this.description = d; return this; }
        public Builder notes(String n)             { this.notes = n; return this; }
        public Builder additionalNotes(String n)   { this.additionalNotes = n; return this; }
        public Builder identifier(String i)        { this.identifier = i; return this; }
        public Builder certNumber(String c)        { this.certNumber = c; return this; }
        public Builder standards(String s)         { this.standards = s; return this; }
        public Builder layout(String l)            { this.layout = l; return this; }
        public Builder filePath(String fp)         { this.filePath = fp; return this; }

        public ProductGroupData build() {
            return new ProductGroupData(this);
        }
    }
}
