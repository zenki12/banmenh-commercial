import type { NarrativeKb } from "../../schemas/numerology-kb";
import type { NumerologyReport, PeriodIndicatorResult } from "../report";
import { asRecord, escapeHtml } from "./common";

type PyramidPeakAnalysisData = {
  title: string;
  icon: string;
  intro: string;
  career: string;
  opportunity: string;
  relationship: string;
  health: string;
  warnings: string[];
  innerQ: string;
};

// ════════════════════════════════════════════════════════════════════════════
// CHỈ SỐ SỨ MỆNH (DESTINY NUMBER) — Phân tích sâu theo PDF tham khảo
// Gọi: NT.destiny[num](name, d)
// ════════════════════════════════════════════════════════════════════════════

export function pyramidPeakAnalysis(
  peakIndex: number,
  peakNum: number,
  period: string,
  challengeNum: number | null,
  name: string,
): string {
  const safeName = escapeHtml(name);
  const safePeriod = escapeHtml(period);
    const periodLabels = ['Đầu đời & Thanh Xuân', 'Trưởng Thành', 'Chín Muồi', 'Hoàn Thành & Di Sản'];
    const periodLabel = periodLabels[peakIndex] || `Giai đoạn ${peakIndex + 1}`;
    const n = (typeof peakNum === 'number') ? (peakNum > 9 ? peakNum : peakNum) : parseInt(peakNum) || 1;

    // ── Data per peak number ──────────────────────────────────────────────────
    // ── Data per peak number ──────────────────────────────────────────────────
    const peakData: Record<number, PyramidPeakAnalysisData> = {
      1: {
        title: 'Người Tiên Phong — Năng Lượng Khởi Đầu & Lãnh Đạo',
        icon: '🔥',
        intro: `Trong giai đoạn <strong>${safePeriod}</strong>, vũ trụ đặt <strong>${safeName}</strong> vào đúng vị trí mà số 1 được sinh ra để chiếm lĩnh: <em>vị trí đầu tiên, người khai mở con đường</em>. Đây là ${periodLabel.toLowerCase()} mà mỗi quyết định bạn đưa ra — dù lớn hay nhỏ — đều khắc sâu vào hành trình linh hồn nhiều hơn bạn có thể nhận ra. Số 1 không cho phép bạn đứng sau, không cho phép bạn chờ đợi. Nó thúc đẩy bạn về phía trước với một sức mạnh mà đôi khi chính bạn cũng không hiểu nó từ đâu đến.`,
        career: 'Giai đoạn số 1 đỉnh cao là thời điểm vàng để <strong>khởi nghiệp, nhận vị trí lãnh đạo, hoặc đặt nền móng cho một hướng đi hoàn toàn mới</strong>. Các lĩnh vực phát huy tốt nhất: kinh doanh độc lập, sáng lập startup, quản lý dự án, vai trò trưởng nhóm. Hãy gắn tên mình vào những công trình trong giai đoạn này — đừng để người khác thu hoạch từ hạt giống bạn gieo.',
        opportunity: 'Cánh cửa lớn nhất mở ra cho những ai <strong>dám hành động trước khi sẵn sàng 100%</strong>. Mọi bước đi chủ động trong giai đoạn số 1 đều được khuếch đại — một cuộc gặp gỡ đúng lúc, một dự án táo bạo, một quyết định thay đổi ngành nghề. Đây cũng là lúc xây dựng personal brand sẽ cho quả trong nhiều năm tới.',
        relationship: 'Bạn có sức hút tự nhiên rất mạnh trong giai đoạn này — nhưng hãy tỉnh táo: <strong>sức hút không đồng nghĩa với sự phù hợp</strong>. Trong tình yêu, bạn cần người bạn đời đủ vững để không bị lấn át. Hãy chủ động rèn luyện kỹ năng lắng nghe — đây là điểm yếu tự nhiên cần khắc phục trong giai đoạn số 1.',
        health: 'Năng lượng tràn đầy nhưng nguy cơ <strong>đốt cháy bản thân</strong> rất cao. Não bộ và hệ thần kinh trung ương là vùng cần chú ý. Hãy đặt lịch nghỉ ngơi như một cuộc họp quan trọng — không thể huỷ. Thiền định, yoga hoặc bất kỳ hoạt động "làm chậm" nào là đối trọng hoàn hảo cho năng lượng Yang cực mạnh của số 1.',
        warnings: [
          '<strong>Cô đơn tự nguyện vì cái tôi quá lớn</strong> — xa cách người thân vì không muốn ai "cản trở" bước đi của mình',
          '<strong>Bướng bỉnh khi sai</strong> — từ chối thay đổi hướng đi dù có bằng chứng rõ ràng, vì nhận sai cảm thấy như một thất bại',
          '<strong>Đốt cầu quan hệ</strong> — quyết định quá nhanh, phát ngôn quá thẳng, gây tổn thương những người có thể là đồng minh lâu dài'
        ],
        innerQ: `<strong>${safeName}</strong>, câu hỏi sâu nhất của giai đoạn này là: <em>"Bạn đang dẫn dắt vì muốn phục vụ và tạo ra giá trị — hay vì cần được khẳng định và công nhận?"</em>`,
      },
      2: {
        title: 'Người Hòa Giải — Năng Lượng Kết Nối & Cộng Tác',
        icon: '🤝',
        intro: `Giai đoạn <strong>${safePeriod}</strong> đặt <strong>${safeName}</strong> vào trường năng lượng nhẹ nhàng nhưng đầy chiều sâu của <em>Số 2 — Người Cầu Nối</em>. Đây là ${periodLabel.toLowerCase()} mà vũ trụ không thưởng cho sức mạnh cá nhân — mà thưởng cho <strong>khả năng lắng nghe, kiên nhẫn và hợp tác</strong>. Những ai hiểu được quy luật này sẽ xây được những liên minh bền vững và tạo ra tác động gấp nhiều lần so với một mình chiến đấu.`,
        career: '<strong>Hợp tác, đối tác chiến lược và các vai trò hỗ trợ cao cấp</strong> là nơi năng lượng số 2 phát huy tối đa. Tư vấn, nhân sự, ngoại giao, trị liệu, quản lý quan hệ — tất cả đều được ủng hộ. Một cuộc hợp tác đúng người được ký kết trong giai đoạn này có thể thay đổi toàn bộ hướng đi sự nghiệp của bạn trong thập kỷ tới.',
        opportunity: 'Cơ hội vàng đến từ <strong>những mối quan hệ đặc biệt xuất hiện không báo trước</strong> — người thầy, đối tác kinh doanh, bạn đời tri kỷ. Đây cũng là thời điểm tốt để phát triển kỹ năng lắng nghe chiến lược: loại kỹ năng khiến người đối diện cảm thấy họ là người quan trọng nhất trong phòng.',
        relationship: 'Tình yêu và các mối quan hệ gần gũi là <strong>tâm điểm của giai đoạn số 2</strong>. Bạn có khả năng nuôi dưỡng kết nối sâu sắc và bền vững — nhưng hãy cẩn thận không hy sinh nhu cầu cốt lõi của mình. Ranh giới lành mạnh không phải là ích kỷ — đó là điều kiện để bạn tiếp tục cho đi bền vững.',
        health: 'Năng lượng số 2 cực kỳ nhạy cảm với <strong>căng thẳng môi trường và cảm xúc xung quanh</strong>. Hệ miễn dịch và tiêu hóa dễ bị ảnh hưởng khi có xung đột kéo dài. Hãy tạo ra những "vùng yên tĩnh" trong ngày — không điện thoại, không thông báo, chỉ là bạn và hơi thở.',
        warnings: [
          '<strong>Mất bản thân trong việc đáp ứng kỳ vọng người khác</strong> — đến mức không còn biết mình thực sự muốn gì và là ai',
          '<strong>Thiếu quyết đoán quá mức</strong> — bỏ lỡ những cơ hội thực sự đòi hỏi phải hành động nhanh và dứt khoát',
          '<strong>Thu hút và ôm giữ năng lượng tiêu cực</strong> của người khác vào mình đến mức kiệt sức trong âm thầm'
        ],
        innerQ: `<strong>${safeName}</strong>, câu hỏi sâu nhất của giai đoạn này là: <em>"Bạn đang hợp tác và cho đi từ sức mạnh nội tâm — hay từ nỗi sợ xung đột và bị từ chối?"</em>`,
      },
      3: {
        title: 'Người Biểu Đạt — Năng Lượng Sáng Tạo & Truyền Cảm Hứng',
        icon: '✨',
        intro: `Giai đoạn <strong>${safePeriod}</strong> là mùa hoa nở trong hành trình của <strong>${safeName}</strong> — được chiếu sáng bởi <em>Số 3 — Người Nghệ Sĩ & Người Kể Chuyện</em>. Đây là ${periodLabel.toLowerCase()} mà vũ trụ không chỉ cho phép bạn biểu đạt — vũ trụ <strong>yêu cầu</strong> bạn làm điều đó. Bởi vì giọng nói của bạn, câu chuyện của bạn, và cách bạn nhìn thế giới là thứ mà ai đó đang chờ đợi để được nghe.`,
        career: 'Lĩnh vực nghệ thuật, truyền thông, marketing, giảng dạy, diễn thuyết và viết lách đều <strong>được năng lượng số 3 ủng hộ mạnh mẽ</strong>. Nếu bạn chưa từng thử sáng tạo nội dung, xuất bản, hoặc dạy điều gì đó bạn biết — đây chính là lúc. Giọng nói và câu chuyện của bạn trong giai đoạn này mang sức lan toả đặc biệt mà không phải lúc nào cũng có.',
        opportunity: 'Cơ hội lớn nhất đến từ <strong>việc chia sẻ kiến thức và trải nghiệm</strong> — dưới bất kỳ hình thức nào. Đây cũng là thời điểm vàng để xây dựng mạng lưới xã hội, kết nối với những người sáng tạo cùng chí hướng, và thu hút sự chú ý từ những người đúng đắn. Thương hiệu cá nhân xây dựng trong giai đoạn này phục vụ bạn lâu dài.',
        relationship: 'Sức hút và năng lượng của bạn ở <strong>đỉnh cao trong giai đoạn số 3</strong>. Bạn thu hút người khác một cách tự nhiên — nhưng hãy tỉnh táo phân biệt kết nối có chiều sâu với quan hệ chỉ tồn tại bề mặt. Tình yêu trong giai đoạn số 3 thường bay bổng và đẹp — hãy tận hưởng nhưng đừng để cảm xúc che mờ sự sáng suốt.',
        health: 'Nguy cơ lớn nhất là <strong>dùng caffeine và kích thích để thay thế giấc ngủ</strong>. Hệ hô hấp, cổ họng và tuyến giáp cần được chú ý. Hãy để cơ thể được nghỉ ngơi đủ giấc — sáng tạo thực sự cần không gian tĩnh lặng bên cạnh sự sôi động bề ngoài.',
        warnings: [
          '<strong>Phân tán năng lượng vào quá nhiều hướng cùng lúc</strong> — bắt đầu nhiều dự án thú vị nhưng hoàn thành rất ít',
          '<strong>Dùng sự vui vẻ và duyên dáng như lớp giáp</strong> để tránh đối mặt với những vấn đề cốt lõi và cảm xúc thực sự',
          '<strong>Thiếu kỷ luật tài chính</strong> — thu nhập tốt trong giai đoạn này nhưng cũng tiêu dễ dàng không kém, tạo ra bất ổn dài hạn'
        ],
        innerQ: `<strong>${safeName}</strong>, câu hỏi sâu nhất của giai đoạn này là: <em>"Bạn đang thể hiện bản thân để kết nối thực sự và tạo ra giá trị — hay để được chú ý và công nhận?"</em>`,
      },
      4: {
        title: 'Người Kiến Tạo — Năng Lượng Nền Tảng & Kỷ Luật',
        icon: '🏗️',
        intro: `Giai đoạn <strong>${safePeriod}</strong> đưa <strong>${safeName}</strong> vào trường năng lượng vững chắc của <em>Số 4 — Người Xây Dựng Nền Móng</em>. Đây là ${periodLabel.toLowerCase()} mà vũ trụ không trao cho bạn những thứ hào nhoáng và dễ dàng — mà trao thứ <strong>quý giá hơn nhiều: cơ hội xây dựng điều gì đó thực sự bền vững</strong>. Trong xã hội thích ngắn hạn, đỉnh cao số 4 là loại năng lượng hiếm có và vô cùng cần thiết.`,
        career: 'Giai đoạn lý tưởng để <strong>hệ thống hóa, cấu trúc hóa và xây dựng quy trình bền vững</strong> trong sự nghiệp. Bất kỳ đầu tư nghiêm túc nào về nâng cao chuyên môn hoặc hoàn thiện sản phẩm dài hạn đều sẽ cho quả. Bất động sản, kỹ thuật, tài chính dài hạn và các nghề đòi hỏi tính chính xác cao đều được số 4 đặc biệt ủng hộ.',
        opportunity: 'Những nỗ lực <strong>âm thầm, kiên trì và không hào quang</strong> trong giai đoạn này được đền bù xứng đáng. Đây là lúc tốt nhất để ký những cam kết dài hạn và đặt xuống những viên gạch đầu tiên cho mục tiêu 5-10 năm. Người kiên nhẫn với số 4 sẽ thu hoạch những gì người vội vã không bao giờ đạt được.',
        relationship: 'Số 4 mang đến <strong>xu hướng trở nên nghiêm túc hơn trong tình yêu</strong> — và đó là điều tốt. Bạn tìm kiếm sự ổn định và trung thành, sẵn sàng đầu tư lâu dài. Tuy nhiên đừng để sự "thực tế" giết chết sự lãng mạn hoàn toàn — đôi khi người bạn yêu cần cảm xúc hơn là kế hoạch.',
        health: 'Bạn có xu hướng bỏ qua cơ thể vì làm việc quá sức. <strong>Xương khớp, lưng và hệ cơ xương cần được chú ý đặc biệt</strong>. Đặt lịch tập thể dục đều đặn — như một cuộc hẹn bất di bất dịch, không phải khi "có thời gian".',
        warnings: [
          '<strong>Cứng nhắc quá mức với kế hoạch</strong> — bám vào lịch trình ngay cả khi thực tế đã thay đổi và đòi hỏi linh hoạt',
          '<strong>Ôm quá nhiều trách nhiệm một mình</strong> và kiệt sức trong im lặng thay vì nhờ đến sự hỗ trợ đúng lúc',
          '<strong>Thực dụng quá mức khiến bỏ lỡ cơ hội</strong> — có những thời điểm cần sự liều lĩnh và tư duy sáng tạo mà số 4 thuần túy không cung cấp'
        ],
        innerQ: `<strong>${safeName}</strong>, câu hỏi sâu nhất của giai đoạn này là: <em>"Bạn đang xây dựng từ tình yêu với điều đó và niềm tin vào tương lai — hay từ nỗi sợ mọi thứ sẽ sụp đổ nếu bạn dừng lại?"</em>`,
      },
      5: {
        title: 'Người Giải Phóng — Năng Lượng Thay Đổi & Tự Do',
        icon: '🌊',
        intro: `Giai đoạn <strong>${safePeriod}</strong> thổi vào cuộc đời <strong>${safeName}</strong> một cơn gió lớn của <em>Số 5 — Người Phá Vỡ Giới Hạn</em>. Đây là ${periodLabel.toLowerCase()} mà những thay đổi lớn — đôi khi bất ngờ và không được mời — <strong>không phải là tai họa mà là món quà vũ trụ</strong> tặng cho những ai đủ dũng cảm nắm lấy. Số 5 không cho phép bạn đứng yên. Và chính sự chuyển động đó là nguồn sống của bạn trong giai đoạn này.`,
        career: 'Sự nghiệp trong giai đoạn số 5 cần <strong>sự linh hoạt và khả năng thích nghi</strong>. Những cơ hội tốt nhất thường đến từ hướng không ai ngờ — đừng từ chối chúng vì "không nằm trong kế hoạch". Du lịch, bán hàng, marketing đa kênh, truyền thông và bất cứ nghề nào liên quan đến sự thay đổi đều được ủng hộ mạnh.',
        opportunity: 'Cơ hội đến từ <strong>những gặp gỡ tình cờ, chuyến đi bất ngờ và cuộc trò chuyện tưởng như vô tình</strong>. Hãy giữ lịch trình linh hoạt và tâm thế mở — những cánh cửa trong giai đoạn số 5 chỉ mở trong chớp mắt và không chờ người chưa sẵn sàng.',
        relationship: 'Tình yêu trong giai đoạn số 5 <strong>hào hứng và cuốn hút nhưng cũng dễ bốc hơi</strong> nếu thiếu nền tảng. Bạn cần người bạn đời đủ linh hoạt để đi cùng bạn trong sự thay đổi, không phải người kéo bạn ngược lại. Hãy rõ ràng với chính mình về điều bạn thực sự tìm kiếm.',
        health: 'Nguy cơ lớn nhất là <strong>lạm dụng kích thích</strong> — quá nhiều trải nghiệm, quá ít nghỉ ngơi thực sự. Hệ thần kinh và tiêu hóa dễ bị ảnh hưởng. Hãy tạo ra ít nhất một thói quen ổn định mỗi ngày — như điểm neo trong cơn sóng của số 5.',
        warnings: [
          '<strong>Chạy trốn cam kết thay vì chấp nhận và trưởng thành</strong> — phân biệt sự tự do thực sự với việc né tránh trách nhiệm',
          '<strong>Tìm kiếm khoái cảm tức thì</strong> và bỏ qua những hậu quả tài chính, sức khỏe, quan hệ trong dài hạn',
          '<strong>Thay đổi liên tục đến mức mất phương hướng</strong> — không ai kể cả bạn biết bạn thực sự muốn gì và là ai'
        ],
        innerQ: `<strong>${safeName}</strong>, câu hỏi sâu nhất của giai đoạn này là: <em>"Sự tự do bạn đang tìm kiếm là tự do để hướng đến điều gì — hay chỉ là tự do để thoát khỏi điều gì?"</em>`,
      },
      6: {
        title: 'Người Nuôi Dưỡng — Năng Lượng Tình Yêu & Trách Nhiệm',
        icon: '💛',
        intro: `Giai đoạn <strong>${safePeriod}</strong> đặt <strong>${safeName}</strong> vào trái tim ấm áp của <em>Số 6 — Người Giữ Lửa Gia Đình & Cộng Đồng</em>. Đây là ${periodLabel.toLowerCase()} mà vũ trụ giao cho bạn một trong những nhiệm vụ thiêng liêng nhất: <strong>trở thành nơi nương tựa, người tạo ra sự hài hòa và vẻ đẹp</strong> trong những mối quan hệ xung quanh. Đây không phải giai đoạn của chinh phục — đây là giai đoạn của nuôi dưỡng và chữa lành.`,
        career: 'Các nghề liên quan đến <strong>chăm sóc, giảng dạy, tư vấn, y tế, thiết kế không gian sống</strong> và bất kỳ vai trò nào phục vụ một cộng đồng đều được số 6 ủng hộ đặc biệt. Đây cũng là giai đoạn tốt để xây dựng văn hoá đội nhóm tích cực và làm đẹp môi trường làm việc.',
        opportunity: 'Cơ hội đến từ <strong>phục vụ người khác một cách chân thực và không vụ lợi</strong>. Danh tiếng và sự tin tưởng từ cộng đồng xây dựng trong giai đoạn này không thể mua được bằng tiền — nhưng sẽ mở ra những cánh cửa nghề nghiệp và xã hội rất giá trị sau này.',
        relationship: 'Đây là <strong>đỉnh cao của sự nuôi dưỡng và cam kết sâu sắc</strong>. Tình yêu trong giai đoạn số 6 có thể đạt đến chiều sâu mà các giai đoạn khác không có. Nhưng hãy cẩn thận với xu hướng kiểm soát người thân "vì muốn tốt cho họ" — nuôi dưỡng lành mạnh là trao quyền, không phải tạo sự phụ thuộc.',
        health: 'Bạn dễ bỏ qua sức khỏe <strong>của chính mình</strong> trong khi chăm sóc người khác. Tim, tuần hoàn và hậu quả của căng thẳng tích tụ cần được chú ý. Hãy nhớ: bạn không thể rót nước từ một chiếc bình rỗng.',
        warnings: [
          '<strong>Kiểm soát người thân vì thương yêu</strong> — nhưng kiểm soát vẫn là kiểm soát, dù động cơ tốt đến đâu',
          '<strong>Hy sinh quá mức đến mức cảm thấy oán giận</strong> — khi sự cho đi đến từ cảm giác nghĩa vụ thay vì tình yêu thực sự',
          '<strong>Nhận trách nhiệm cho cảm xúc và hạnh phúc của người khác</strong> — đây là gánh nặng không ai có thể mang hộ ai'
        ],
        innerQ: `<strong>${safeName}</strong>, câu hỏi sâu nhất của giai đoạn này là: <em>"Bạn đang yêu thương và chăm sóc từ sự sung mãn nội tâm — hay từ nỗi sợ rằng nếu không làm vậy, bạn sẽ mất đi tình yêu của họ?"</em>`,
      },
      7: {
        title: 'Người Tìm Kiếm Sự Thật — Năng Lượng Tri Thức & Tâm Linh',
        icon: '🔮',
        intro: `Giai đoạn <strong>${safePeriod}</strong> là mùa thu hoạch của <strong>${safeName}</strong> — không phải thu hoạch vật chất mà thu hoạch <em>tri thức, trí tuệ và sự giác ngộ nội tâm</em>. <em>Số 7 — Người Tìm Sự Thật</em> không phải là con số của thành công nhanh chóng. Đây là ${periodLabel.toLowerCase()} mà <strong>chiều sâu và chất lượng của sự hiểu biết quan trọng hơn tốc độ và số lượng</strong>.`,
        career: 'Nghiên cứu chuyên sâu, phân tích, tư vấn chiến lược, tâm lý học, khoa học và <strong>bất kỳ lĩnh vực nào đòi hỏi sự đào sâu nghiêm túc</strong> đều được năng lượng số 7 ủng hộ. Đây là lúc để trở thành chuyên gia thực sự — không phải người biết nhiều thứ loáng thoáng mà là người hiểu một thứ ở mức độ người khác không thể đạt được.',
        opportunity: 'Cơ hội lớn đến từ <strong>việc chia sẻ tri thức chuyên sâu</strong> mà bạn đã tích lũy. Một khoá học được tạo ra, một phương pháp được hệ thống hoá — những thứ này trong giai đoạn số 7 có thể định hình danh tiếng của bạn trong nhiều năm tới.',
        relationship: 'Số 7 là con số của <strong>sự cô đơn thiêng liêng</strong> — bạn cần không gian riêng để suy ngẫm và tái tạo năng lượng. Người bạn đời lý tưởng là người hiểu và tôn trọng điều đó, không cảm thấy bị từ chối khi bạn cần không gian một mình.',
        health: '<strong>Não bộ và hệ thần kinh</strong> là vùng cần chú ý — đặc biệt là rối loạn giấc ngủ do suy nghĩ quá nhiều. Hãy tập thực hành "tắt não" vào buổi tối. Thiên nhiên là liều thuốc tốt nhất cho số 7.',
        warnings: [
          '<strong>Cô lập quá mức</strong> — rút lui khỏi các mối quan hệ đến mức trở thành cô đơn không lành mạnh',
          '<strong>Hoài nghi và lạnh lùng với cảm xúc</strong> — phân tích mọi thứ đến mức không thể kết nối và tin tưởng người khác',
          '<strong>Ôm giữ tri thức cho riêng mình</strong> — không chia sẻ những gì bạn biết vì sợ bị phán xét hoặc vì cảm giác người khác không hiểu được'
        ],
        innerQ: `<strong>${safeName}</strong>, câu hỏi sâu nhất của giai đoạn này là: <em>"Sự thu mình và chiều sâu bạn theo đuổi là để hiểu bản thân và phục vụ người khác tốt hơn — hay để trốn tránh thế giới và những mối quan hệ đòi hỏi sự dễ tổn thương?"</em>`,
      },
      8: {
        title: 'Người Kiến Tạo Quyền Lực — Năng Lượng Thịnh Vượng & Ảnh Hưởng',
        icon: '⚡',
        intro: `Giai đoạn <strong>${safePeriod}</strong> đặt <strong>${safeName}</strong> vào trường năng lượng mạnh mẽ và đòi hỏi nhất của <em>Số 8 — Người Kiến Tạo Thịnh Vượng</em>. Vũ trụ không trao số 8 cho người yếu lòng — nó trao cho những ai <strong>có khả năng chịu đựng áp lực lớn, dám đối mặt với thực tế khắc nghiệt và vẫn tiến lên</strong>. Đây là ${periodLabel.toLowerCase()} mà thành công vật chất và sức ảnh hưởng là hoàn toàn có thể.`,
        career: 'Tài chính, quản lý cấp cao, kinh doanh quy mô lớn, bất động sản và <strong>các lĩnh vực đòi hỏi tư duy chiến lược và quản lý nguồn lực</strong> đều được số 8 ủng hộ. Đây là giai đoạn để đàm phán những thỏa thuận lớn, thăng tiến vị trí quản lý cấp cao, và xây dựng sức ảnh hưởng tài chính thực sự.',
        opportunity: '<strong>Thu nhập và tài sản tăng trưởng mạnh</strong> là đặc trưng của giai đoạn số 8 — nhưng chỉ khi bạn hành động từ sự chính trực. Bộ lọc tốt nhất cho mọi cơ hội: "Liệu điều này có tạo ra giá trị thực cho người khác không?"',
        relationship: 'Bạn yêu mạnh mẽ và bảo hộ — nhưng <strong>cần một người bạn đời không bị đe dọa bởi sức mạnh của bạn</strong>. Hãy cẩn thận không để sự bận rộn và tập trung vào sự nghiệp làm lạnh dần các mối quan hệ quan trọng.',
        health: '<strong>Hệ tim mạch và huyết áp là những vùng cần giám sát</strong> trong giai đoạn áp lực cao của số 8. Tập thể dục không chỉ là sức khỏe — với số 8, nó còn là cách giải phóng áp lực tích tụ. Hãy chuyển hóa căng thẳng qua thể chất, không phải dồn nén nó.',
        warnings: [
          '<strong>Ám ảnh với kết quả đến mức bỏ qua con người</strong> — xem người khác qua lăng kính năng suất và lợi ích thay vì giá trị con người',
          '<strong>Tích luỹ mà không bao giờ thấy đủ</strong> — chu kỳ "chỉ cần thêm một chút nữa" khiến ngưỡng hài lòng không bao giờ đến',
          '<strong>Dùng quyền lực để kiểm soát thay vì trao quyền</strong> — đây là sự lãng phí lớn nhất của năng lượng số 8'
        ],
        innerQ: `<strong>${safeName}</strong>, câu hỏi sâu nhất của giai đoạn này là: <em>"Thịnh vượng bạn đang xây dựng sẽ phục vụ điều gì — và khi đạt được, cuộc sống của những ai xung quanh bạn sẽ tốt hơn không?"</em>`,
      },
      9: {
        title: 'Người Hoàn Thành Chu Kỳ — Năng Lượng Nhân Đạo & Buông Bỏ',
        icon: '🌏',
        intro: `Giai đoạn <strong>${safePeriod}</strong> đặt <strong>${safeName}</strong> vào trường năng lượng sâu thẳm và nhân văn nhất của <em>Số 9 — Người Hoàn Thành, Linh Hồn Đã Trải Qua Nhiều</em>. Đây là ${periodLabel.toLowerCase()} mà sứ mệnh của bạn vượt ra khỏi giới hạn của bản thân — <strong>vũ trụ gọi bạn đến những điều lớn hơn chính mình</strong>. Số 9 không phải về tích luỹ — nó về cho đi, về buông bỏ, về phục vụ điều gì đó có ý nghĩa bền vững.`,
        career: '<strong>Nhân đạo, giáo dục, nghệ thuật chữa lành, lãnh đạo cộng đồng và bất kỳ lĩnh vực nào có tác động xã hội rộng lớn</strong> đều được ủng hộ trong giai đoạn số 9. Đây là lúc kiến thức và kinh nghiệm tích lũy từ các giai đoạn trước được tổng hợp thành sự đóng góp thực sự có giá trị.',
        opportunity: 'Cơ hội lớn nhất đến từ <strong>việc kết nối những gì bạn biết với những gì thế giới cần</strong>. Một dự án xã hội, một tác phẩm sáng tạo, một chương trình đào tạo — bất cứ điều gì giúp bạn "trả lại" cho cuộc đời theo cách chỉ bạn có thể làm được.',
        relationship: 'Bạn yêu rộng lớn và vị tha trong giai đoạn này — nhưng <strong>hãy học cách yêu thương với ranh giới lành mạnh</strong>. Buông bỏ những mối quan hệ đã hết vai trò trong hành trình là một hành động yêu thương — với cả họ và bạn.',
        health: 'Hệ miễn dịch và sức khỏe cảm xúc cần được <strong>nuôi dưỡng có ý thức</strong>. Bạn dễ bị kiệt sức vì ôm quá nhiều nỗi đau của người khác. Hãy thực hành buông bỏ theo nghĩa đen — thở ra, nhả ra, và nhớ rằng bạn không phải cứu vớt ai ngoài việc sống trọn vẹn nhất có thể.',
        warnings: [
          '<strong>Ôm giữ vết thương cũ không chịu buông</strong> — tha thứ không phải để người kia xứng đáng, mà để bạn được tự do',
          '<strong>Tự tan trong người khác</strong> — mất ranh giới giữa lòng trắc ẩn lành mạnh và sự hoà tan bản thân',
          '<strong>Cưu mang quá nhiều trách nhiệm nhân đạo</strong> cùng lúc đến mức không thể làm tốt bất kỳ điều nào trong số đó'
        ],
        innerQ: `<strong>${safeName}</strong>, câu hỏi sâu nhất của giai đoạn này là: <em>"Bạn đang cho đi từ sự sung mãn và tình yêu — hay từ cảm giác tội lỗi rằng mình chưa đủ khi chưa cứu được ai đó?"</em>`,
      },
      10: {
        title: 'Người Mang Sức Mạnh Đặc Biệt — Năng Lượng Số 10 Siêu Việt',
        icon: '🌟',
        intro: `Giai đoạn <strong>${safePeriod}</strong> đặt <strong>${safeName}</strong> vào một trong những trường năng lượng đặc biệt nhất của kim tự tháp: <em>Số 10 — Con Số Của Một Chu Kỳ Hoàn Thành Và Bắt Đầu Lại Ở Tầng Cao Hơn</em>. Số 10 trong kim tự tháp không được rút gọn về 1 — nó mang trong mình <strong>năng lượng của Số 1 được tăng cường bởi Số 0 — biểu tượng của tiềm năng vô hạn</strong>. Đây là ${periodLabel.toLowerCase()} với sức mạnh tiên phong cực đại và chiều sâu khôn ngoan từ những gì đã trải qua.`,
        career: 'Số 10 mang <strong>sức mạnh lãnh đạo của Số 1 nhưng với chiều sâu và sự chín chắn lớn hơn nhiều</strong>. Đây là giai đoạn lý tưởng để thành lập hoặc tái cơ cấu tổ chức, dẫn dắt sự thay đổi mang tính hệ thống. Những người sở hữu đỉnh số 10 thường có khả năng hướng dẫn và thôi thúc người khác theo cách rất tự nhiên.',
        opportunity: 'Cơ hội lớn nhất đến từ <strong>việc dẫn dắt và truyền cảm hứng theo cách riêng</strong> — không theo bất kỳ công thức có sẵn nào. Số 10 không đi theo con đường của ai — nó tạo ra con đường. Hãy tin vào trực giác lãnh đạo của bạn, ngay cả khi không ai hiểu hướng đi bạn chọn.',
        relationship: 'Bạn yêu với <strong>sức mạnh và sự quyết tâm đặc trưng của số 1 nhưng mang chiều sâu cảm xúc của số 0</strong>. Khi đã chọn ai, bạn toàn tâm toàn ý. Người bạn đời lý tưởng tôn trọng sức mạnh của bạn như một tài sản, không xem nó là mối đe dọa.',
        health: 'Bạn có nguồn năng lượng thể chất đặc biệt nhưng <strong>hệ thần kinh cần được bảo vệ khỏi sự kích thích liên tục</strong>. Tạo ra những khoảng "im lặng" trong ngày — không để thông tin, quyết định và trách nhiệm lấp đầy mọi khoảng trống trong nhận thức.',
        warnings: [
          '<strong>Ôm tất cả không chia sẻ</strong> — cảm thấy mình phải tự mình làm mọi thứ vì không ai làm tốt như mình',
          '<strong>Không biết khi nào cần dừng lại</strong> — đốt cháy năng lượng vô tận đến khi cơ thể và tinh thần bắt buộc phải dừng',
          '<strong>Cô đơn ở đỉnh cao</strong> — không chia sẻ được với ai vì cảm thấy không ai ở cùng tần số'
        ],
        innerQ: `<strong>${safeName}</strong>, câu hỏi sâu nhất của giai đoạn này là: <em>"Sức mạnh và tầm ảnh hưởng bạn đang xây dựng sẽ được dùng để làm gì — và ai sẽ được hưởng lợi từ điều đó cùng với bạn?"</em>`,
      },
      11: {
        title: 'Nhà Giác Ngộ — Năng Lượng Trực Giác Siêu Việt & Sứ Mệnh Ánh Sáng',
        icon: '💫',
        intro: `Giai đoạn <strong>${safePeriod}</strong> đặt <strong>${safeName}</strong> vào trường năng lượng bậc thầy hiếm có của <em>Số 11 — Con Số Master, Người Mang Ánh Sáng</em>. Đây là ${periodLabel.toLowerCase()} mà ranh giới giữa trực giác và lý trí mờ dần — <strong>những điều bạn "cảm nhận" thường chính xác hơn những gì bạn "suy nghĩ"</strong>. Số 11 trong kim tự tháp không được rút gọn về 2 — nó mang tần số rung động hoàn toàn khác, đòi hỏi mức độ trưởng thành và nhận thức về bản thân rất cao.`,
        career: 'Trực giác đặc biệt nhạy bén là <strong>công cụ nghề nghiệp mạnh nhất</strong> của bạn trong giai đoạn này. Bất kỳ lĩnh vực nào đòi hỏi sự sáng tạo đột phá, tầm nhìn chiến lược xa và khả năng truyền cảm hứng cho tập thể — lãnh đạo tinh thần, tư vấn cao cấp, nghệ thuật, giáo dục đổi mới — đều phát huy tối đa năng lượng số 11.',
        opportunity: 'Những ý tưởng và tầm nhìn bạn nhận được trong giai đoạn này thường <strong>đi trước thời đại 5-10 năm</strong>. Hãy ghi lại tất cả — ngay cả những thứ có vẻ điên rồ — vì chúng sẽ có ý nghĩa sau này. Đây cũng là thời điểm tốt để phát triển và chia sẻ những khả năng tâm linh và trực giác một cách có cấu trúc và có ích.',
        relationship: 'Bạn cảm nhận được cảm xúc và nhu cầu chưa được nói của người khác theo cách mà ít người có. Đây là <strong>thiên phú — nhưng chỉ khi bạn học được cách giữ ranh giới năng lượng rõ ràng</strong>. Không phải nhiệm vụ của bạn là chữa lành mọi người bạn gặp.',
        health: 'Hệ thần kinh cực kỳ nhạy cảm trong giai đoạn số 11. <strong>Thiền định không phải là tuỳ chọn — đó là nhu cầu sinh tồn</strong>. Hãy tạo ra những khoảng "detox năng lượng" thường xuyên: thời gian trong thiên nhiên, không điện thoại, không tiếp nhận thông tin cảm xúc từ người khác.',
        warnings: [
          '<strong>Gánh nặng trách nhiệm quá lớn</strong> — cảm thấy mình phải cứu hoặc chữa lành tất cả mọi người xung quanh',
          '<strong>Lo lắng và kiệt sức thần kinh kinh niên</strong> — hệ thần kinh siêu nhạy cảm liên tục bị kích thích mà không có thời gian phục hồi',
          '<strong>Dao động giữa xuất chúng và sụp đổ</strong> mà không có điểm trung bình ổn định nào giữa hai thái cực'
        ],
        innerQ: `<strong>${safeName}</strong>, câu hỏi sâu nhất của giai đoạn này là: <em>"Bạn đang sống với và từ những khả năng đặc biệt của mình — hay đang bị chúng dẫn dắt đến kiệt sức và mất phương hướng?"</em>`,
      },
      22: {
        title: 'Kiến Trúc Sư Vũ Trụ — Năng Lượng Tạo Ra Di Sản Vĩnh Cửu',
        icon: '🏛️',
        intro: `Giai đoạn <strong>${safePeriod}</strong> đặt <strong>${safeName}</strong> vào trường năng lượng hùng vĩ hiếm có của <em>Số 22 — Kiến Trúc Sư Bậc Thầy</em>. Đây là ${periodLabel.toLowerCase()} mà vũ trụ trao cho bạn vừa <strong>tầm nhìn của nhà tiên tri vừa bàn tay của người thợ thủ công có tay nghề cao</strong> — khả năng hiếm hoi biến những điều phi thường thành hiện thực vật lý. Số 22 không xây nhà — nó xây đế chế, xây phong trào, xây hệ thống tồn tại sau khi người xây đã rời đi.`,
        career: 'Bạn có khả năng tạo ra những dự án và tổ chức có <strong>tầm ảnh hưởng xuyên thế hệ</strong>. Kiến trúc, kỹ thuật, chính sách công, lãnh đạo tổ chức quốc tế, xây dựng di sản văn hoá, hệ thống giáo dục — bất kỳ lĩnh vực nào kết hợp tầm nhìn vĩ mô với khả năng thực thi cụ thể đều xứng đáng với số 22.',
        opportunity: 'Những cơ hội trong giai đoạn này thường có <strong>quy mô lớn hơn những gì bạn nghĩ mình xứng đáng nhận</strong>. Đừng co lại. Vũ trụ giao những dự án lớn cho số 22 bởi vì linh hồn bạn đã chuẩn bị — ngay cả khi tâm trí còn nghi ngờ.',
        relationship: 'Bạn cần những người bạn đời và cộng sự <strong>đủ tin tưởng để chia sẻ tầm nhìn lớn và đủ thực tế để giữ bạn có chân trên mặt đất</strong>. Đây là giai đoạn cần những mối quan hệ có chiều sâu và nền tảng vững chắc, không phải những kết nối xã giao phù du.',
        health: 'Gánh nặng của trách nhiệm lớn có thể đè nặng lên hệ thần kinh và tâm lý. <strong>Áp lực kỳ vọng cao cần được quản lý có ý thức</strong>. Hãy xây dựng những thói quen phục hồi năng lượng nghiêm túc như một phần của kỷ luật hàng ngày, không phải như phần thưởng khi "xong việc".',
        warnings: [
          '<strong>Áp lực kỳ vọng tự đặt ra</strong> — trở thành gánh nặng đè nặng đến mức tê liệt và không thể hành động',
          '<strong>Thất vọng sâu khi thực tế chuyển động chậm hơn tầm nhìn</strong> — dẫn đến bỏ cuộc giữa chừng ngay trước khi đạt đến đỉnh',
          '<strong>Cô đơn của người nhìn xa hơn đám đông</strong> — không ai xung quanh thực sự hiểu được điều bạn đang cố tạo ra'
        ],
        innerQ: `<strong>${safeName}</strong>, câu hỏi sâu nhất của giai đoạn này là: <em>"Bạn đang kiến tạo từ Sứ Mệnh và tình yêu với điều đó — hay từ nhu cầu được lịch sử ghi nhận và nhớ đến?"</em>`,
      },
    };

    const pd = peakData[n] || peakData[1];
    const challengeSuffix = challengeNum !== null
      ? `<p class="nar" style="margin-top:0.5rem;font-size:0.93em;color:#64748b;"><em>📌 Thử thách song hành trong giai đoạn này: <strong>Số ${challengeNum}</strong> — đây là bài học mà năng lượng đỉnh cao số ${n} buộc bạn phải đối mặt và vượt qua để phát huy hết tiềm năng.</em></p>` : '';

    return `
    <div class="peak-analysis-block">
      <div class="peak-analysis-header">
        <div class="peak-analysis-num">${n}</div>
        <div>
          <div class="peak-analysis-kicker">${['Đỉnh Thứ Nhất', 'Đỉnh Thứ Hai', 'Đỉnh Thứ Ba', 'Đỉnh Thứ Tư'][peakIndex] || 'Đỉnh Cao'} — ${periodLabel}</div>
          <div class="peak-analysis-title">${pd.icon} ${pd.title}</div>
          <div class="peak-analysis-age">${safePeriod}</div>
        </div>
      </div>

      <p class="nar">${pd.intro}</p>
      ${challengeSuffix}

      <div class="peak-aspect-grid">
        <div class="peak-aspect-box career">
          <div class="peak-aspect-label">💼 Sự nghiệp & Tài chính</div>
          <p class="peak-aspect-text">${pd.career}</p>
        </div>
        <div class="peak-aspect-box opportunity">
          <div class="peak-aspect-label">🌱 Cơ hội mở ra</div>
          <p class="peak-aspect-text">${pd.opportunity}</p>
        </div>
        <div class="peak-aspect-box love">
          <div class="peak-aspect-label">💞 Tình yêu & Quan hệ</div>
          <p class="peak-aspect-text">${pd.relationship}</p>
        </div>
        <div class="peak-aspect-box health">
          <div class="peak-aspect-label">🌿 Sức khỏe & Năng lượng</div>
          <p class="peak-aspect-text">${pd.health}</p>
        </div>
      </div>

      <div class="peak-negatives">
        <div class="peak-negatives-label">⚠️ Các khía cạnh tiêu cực cần tránh</div>
        <ul>
          ${pd.warnings.map(w => `<li>${w}</li>`).join('')}
        </ul>
      </div>

      <div class="peak-reflection">
        <div class="peak-reflection-label">🪷 Câu hỏi chiêm nghiệm nội tâm</div>
        <p>${pd.innerQ}</p>
      </div>
    </div>`;

}

function replaceNarrativeVars(html: string, vars: Record<string, string | number>): string {
  let out = html;
  for (const [key, value] of Object.entries(vars)) {
    out = out.replaceAll(`{{${key}}}`, escapeHtml(String(value)));
  }
  return out;
}

function renderPyramidNarrative(
  narrative: NarrativeKb | undefined,
  group: "pyramidPeak" | "pyramidChallenge",
  number: number | string,
  vars: Record<string, string | number>,
): string {
  const entry = narrative?.[group]?.[String(number)];
  return entry ? replaceNarrativeVars(entry.html, vars) : "";
}

function parsePyramidPeriodAge(str: string): { start: number | null; end: number | null; isOpen: boolean } {
  if (!str) return { start: null, end: null, isOpen: false };
  const rangeM = str.match(/(\d+)\s*[\u2013\-]\s*(\d+)/);
  if (rangeM) return { start: Number.parseInt(rangeM[1] ?? "", 10), end: Number.parseInt(rangeM[2] ?? "", 10), isOpen: false };
  const openM = str.match(/(\d+)/);
  if (openM) return { start: Number.parseInt(openM[1] ?? "", 10), end: null, isOpen: true };
  return { start: null, end: null, isOpen: false };
}

export function buildPyramidSection(
  report: NumerologyReport,
  name: string,
  narrative?: NarrativeKb,
  previewOnly = false,
): string {
  const peaks = report.pyramidPeaks;
  const challenges = report.pyramidChallenges;
  const birthYear = report.input.dobParts.year;

  const buildPeriodHeader = (periodStr: string, idx: number): string => {
    const { start, end, isOpen } = parsePyramidPeriodAge(periodStr);
    const labels = ["Một", "Hai", "Ba", "Bốn"];
    const lb = labels[idx] || String(idx + 1);
    if (start === null) return `6.${idx + 1}. Giai đoạn ${lb}`;
    const sy = birthYear + start;
    if (isOpen) return `6.${idx + 1}. GIAI ĐOẠN ${lb.toUpperCase()} — KỂ TỪ TUỔI ${start} (${sy}) TRỞ ĐI`;
    const ey = birthYear + (end ?? start);
    return `6.${idx + 1}. GIAI ĐOẠN ${lb.toUpperCase()} TỪ ĐẦU TUỔI ${start} (${sy}) TỚI HẾT TUỔI ${end} (${ey})`;
  };

  const renderPeak = (peak: PeriodIndicatorResult, idx: number): string => {
    const data = asRecord(peak.data);
    const period = peak.period || "";
    const n = peak.number % 9 || 9;
    let html = `<h4 class="pyramid-sub-heading">6.${idx + 1}.1. Đỉnh cao của bạn trong giai đoạn này là số ${peak.number}</h4>`;
    const narrativeHtml = renderPyramidNarrative(narrative, "pyramidPeak", n, {
      name,
      period,
      peakIndex: idx + 1,
    });
    if (narrativeHtml) {
      html += narrativeHtml;
    } else {
      if (typeof data.theme === "string") html += `<p class="nar"><em>${data.theme}</em></p>`;
      if (typeof data.opportunity === "string") html += `<p class="nar">${data.opportunity}</p>`;
      if (typeof data.challenge === "string") html += `<p class="nar"><span class="pyramid-note">⚠ Lưu ý:</span> ${data.challenge}</p>`;
      if (typeof data.advice === "string") html += `<p class="nar"><span class="pyramid-advice">★ Lời khuyên:</span> ${data.advice}</p>`;
    }
    const keywords = data.keywords;
    if (Array.isArray(keywords) && keywords.length) {
      html += `<p class="nar pyramid-keywords"><strong>Từ khóa năng lượng:</strong> ${keywords.join(" · ")}</p>`;
    } else if (typeof keywords === "string") {
      html += `<p class="nar pyramid-keywords"><strong>Từ khóa năng lượng:</strong> ${keywords}</p>`;
    }
    return html;
  };

  const renderChallenge = (challenge: PeriodIndicatorResult | undefined, idx: number): string => {
    const data = asRecord(challenge?.data);
    const num = challenge?.number ?? "?";
    const period = challenge?.period || peaks[idx]?.period || "";
    let html = `<h4 class="pyramid-sub-heading challenge">6.${idx + 1}.2. Thử thách của bạn trong giai đoạn này là số ${num}</h4>`;
    const narrativeHtml = renderPyramidNarrative(narrative, "pyramidChallenge", num, { name, period });
    if (narrativeHtml) {
      html += narrativeHtml;
    } else {
      if (typeof data.lesson === "string") html += `<p class="nar">${data.lesson}</p>`;
      if (typeof data.trap === "string") html += `<p class="nar"><span class="pyramid-note">⚡ Bẫy định kiến:</span> ${data.trap}</p>`;
      if (typeof data.how_to_overcome === "string") html += `<p class="nar"><span class="pyramid-advice">✔ Cách vượt qua:</span> ${data.how_to_overcome}</p>`;
    }
    return html;
  };

  const periodsHtml = peaks
    .slice(0, previewOnly ? 1 : peaks.length)
    .map(
      (peak, index) => `
    <div class="pyramid-period">
      <h3 class="pyramid-period-heading">${buildPeriodHeader(peak.period, index)}</h3>
      ${renderPeak(peak, index)}
      ${previewOnly ? "" : renderChallenge(challenges[index], index)}
    </div>`,
    )
    .join("");

  const peakAnalysisHtml = peaks
    .map((peak, index) => pyramidPeakAnalysis(index, peak.number, peak.period, challenges[index]?.number ?? null, name))
    .join("");

  return `
    <p class="nar">Kim Tự Tháp cho thấy <strong>4 giai đoạn</strong> trong cuộc đời bạn — mỗi giai đoạn tương ứng với một đỉnh cao và một thử thách riêng. Đỉnh cao là năng lượng chủ đề bạn nên phát triển trong giai đoạn đó; thử thách là bài học bạn bắt buộc phải vượt qua để tiến lên đỉnh kế tiếp.</p>
    <!-- CHART:pyramid -->
    <div class="pyramid-periods-wrap">${periodsHtml}</div>
    ${previewOnly ? "" : `<h4 class="pyramid-analysis-heading">Phân Tích Chi Tiết Từng Đỉnh Cao</h4>${peakAnalysisHtml}`}
  `;
}
