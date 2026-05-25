import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "san_pham")
public class HaiSan {
    @Id
    private String id;
    
    private String ten;
    private double giaBan;
    private int soLuong;
}