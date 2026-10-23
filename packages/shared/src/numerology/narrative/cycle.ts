import type { NumerologyReport, PeriodIndicatorResult } from "../report";
import { escapeHtml } from "./common";

export type LifeCycleAdvice = {
  career?: string;
  finance?: string;
  health?: string;
  relationship?: string;
  avoid?: string;
};

export type LifeCycleDeepEntry = {
  theme: string;
  paragraphs: string[];
  lesson: string;
  advice?: LifeCycleAdvice;
};

export type LifeCyclePhaseExtraEntry = {
  gieoHat?: string;
  truongThanh?: string;
  vienMan?: string;
};

export function lifeCycleNarrative(
  cycleNum: number,
  num: number,
  period: string,
  name: string,
  kbData?: { theme?: string; cycle1?: string; cycle2?: string; cycle3?: string },
): string {
    const safeName = escapeHtml(name);
    const stageLabels: Record<number, { title: string; shortName: string }> = {
      1: { title: 'Chu kỳ Nền Tảng (Hình Thành)', shortName: 'Hình Thành' },
      2: { title: 'Chu kỳ Xây Dựng (Trưởng Thành)', shortName: 'Trưởng Thành' },
      3: { title: 'Chu kỳ Thu Hoạch (Viên Mãn)', shortName: 'Viên Mãn' },
    };

    // Deep narratives: [cycleNum][num] = { theme, paragraphs[], lesson }
    const deepNarrative: Record<number, Record<number, LifeCycleDeepEntry>> = {
      // ══════════ CHU KỲ 1 — NỀN TẢNG (HÌNH THÀNH) ══════════
      1: {
        1: {
          theme: 'Ngọn lửa đầu đời — Tự khẳng định giữa sóng gió',
          paragraphs: [
            `Trong những năm tháng đầu đời, <strong>${safeName}</strong> mang trong mình năng lượng của số <strong>1</strong> — một ngọn lửa tự khẳng định hiếm gặp ở độ tuổi còn chưa đủ lớn để hiểu tại sao mình lại khác biệt. Bạn không phải đứa trẻ "ngoan" theo nghĩa thụ động — bạn có ý kiến riêng, bạn muốn tự mình làm mọi thứ, và bạn cảm thấy bất an khi bị kiểm soát quá mức. Đây không phải là sự nổi loạn — đây chính là linh hồn tiên phong đang hình thành.`,
            `Những trải nghiệm quan trọng nhất của chu kỳ này thường đến từ những lần <em>bạn bị ai đó gạt sang một bên</em> — không được lắng nghe, không được chọn, không được đứng đầu. Mỗi lần như vậy, trong bạn có thứ gì đó không chịu gập lại. Đó là hạt giống của ý chí lãnh đạo — và dù giai đoạn này có thể đau, nó đang rèn nên thứ không gì có thể bẻ gãy về sau. Bạn cũng học được rằng <strong>sự độc lập không phải là sự lạnh lùng</strong> — mà là biết mình muốn gì ngay cả khi thế giới chưa sẵn sàng nghe.`,
            `Gia đình và môi trường của chu kỳ đầu đời ảnh hưởng lớn đến cách bạn nhìn nhận quyền lực. Nếu bạn được nuôi dưỡng bởi những người biết tôn trọng ý kiến của bạn, bạn lớn lên với sự tự tin lành mạnh. Nếu không, bạn sẽ mang theo một vết thương nhỏ — cảm giác rằng mình phải <em>chiến đấu để tồn tại đúng nghĩa bản thân</em>. Nhưng dù hành trình nào, số 1 trong chu kỳ 1 hứa hẹn điều này: bạn sẽ không giống ai khác — và đó chính xác là điều vũ trụ muốn.`,
          ],
          lesson: `Bài học tâm linh của chu kỳ này không phải là học cách "ngoan hơn" — mà là học cách <strong>tin vào bản năng của chính mình</strong>, ngay cả khi chưa ai xác nhận rằng bạn đúng.`
        },
        2: {
          theme: 'Thế giới cảm xúc — Lớn lên trong sự nhạy cảm',
          paragraphs: [
            `Tuổi thơ và những năm đầu đời của <strong>${safeName}</strong> được bao phủ bởi năng lượng dịu dàng và sâu sắc của số <strong>2</strong>. Trong khi những đứa trẻ khác có thể chạy nhảy ầm ĩ, bạn thường là người ngồi quan sát — cảm nhận mọi thứ với độ nhạy cảm cao đến mức đôi khi tự ngạc nhiên về chính mình. Bạn biết khi nào mẹ buồn trước khi mẹ nói. Bạn nhận ra khi bạn bè không ổn chỉ qua một ánh mắt. Khả năng đọc người này không phải do học — đó là món quà thiên bẩm mà số 2 trao cho bạn.`,
            `Giai đoạn nền tảng với số 2 thường có những bài học đau đớn xung quanh chủ đề <em>ranh giới và lòng tự trọng</em>. Vì quá nhạy cảm và muốn làm mọi người hài lòng, bạn dễ trở thành người mà ai cũng tìm đến khi cần — nhưng hiếm ai hỏi bạn đang cảm thấy gì. Những trải nghiệm này, dù có phần tổn thương, đang dạy bạn một bài học tinh tế nhất mà con người có thể học: <strong>sự khác biệt giữa yêu thương và tự hủy hoại bản thân</strong>.`,
            `Môi trường gia đình và những mối quan hệ đầu đời in sâu vào cách bạn định nghĩa tình yêu. Bạn học cách yêu từ những người xung quanh — và nếu những mô hình đó lành mạnh, bạn lớn lên với khả năng kết nối sâu sắc hiếm ai có. Nếu không, bạn cần thêm thời gian để định nghĩa lại: <em>yêu thương không có nghĩa là mất đi chính mình.</em> Số 2 ở chu kỳ đầu đời đang xây dựng cho bạn một trái tim biết cảm — và đó chính là nền tảng của mọi điều bạn sẽ tạo ra về sau.`,
          ],
          lesson: `Bài học lớn nhất của giai đoạn này là <strong>học cách nhận sự quan tâm với cùng sự ân sủng mà bạn dành để cho đi</strong>. Bạn xứng đáng được quan tâm — không phải chỉ là người quan tâm.`
        },
        3: {
          theme: 'Ánh sáng trẻ thơ — Thế giới là sân khấu của bạn',
          paragraphs: [
            `Tuổi thơ của <strong>${safeName}</strong> với số <strong>3</strong> thường là một bức tranh đầy màu sắc — tiếng cười, những câu chuyện bất tận, những ý tưởng kỳ lạ và một năng lượng gây lây lan theo nghĩa đen nhất. Bạn không cần cố gắng để được chú ý — bạn tự nhiên chiếm lấy không gian bằng sự tồn tại vui vẻ và sáng tạo của mình. Trẻ em khác muốn chơi cùng bạn. Người lớn nhớ đến bạn. Và bạn — thường không biết mình đang làm gì kỳ diệu đến vậy.`,
            `Nhưng bên dưới vẻ ngoài tươi sáng đó, giai đoạn đầu đời của số 3 cũng ẩn chứa những bài học khó hơn. Vì tư duy nhảy múa và không tuyến tính, bạn thường bị gán nhãn là "thiếu tập trung" hay "không hoàn thành được điều gì". Môi trường học thuật cứng nhắc là kẻ thù của linh hồn số 3 — và nếu bạn từng bị bảo rằng mình "không đủ nghiêm túc", hãy biết đây: <strong>hệ thống đó được tạo ra cho số 4, không phải cho số 3.</strong> Thiên phú của bạn nằm ở những nơi người khác không nghĩ đến.`,
            `Điều quan trọng nhất của chu kỳ nền tảng với số 3 là <em>sự biểu đạt</em>. Bạn cần — theo nghĩa sinh tồn — được nói lên, được sáng tạo, được kể chuyện. Khi điều này bị bóp nghẹt, bạn có thể trở nên nội tâm theo cách đau đớn hoặc bùng phát theo những hướng không lành mạnh. Khi được nuôi dưỡng đúng cách, thứ nảy sinh từ tuổi thơ của số 3 là một con người có khả năng chạm đến trái tim người khác bằng ngôn từ và nghệ thuật theo cách không ai dạy được.`,
          ],
          lesson: `Giai đoạn đầu đời dạy bạn rằng <strong>niềm vui không phải là sự phù phiếm — đó là sức mạnh</strong>. Và đường dài nhất bạn có thể đi là đường đi qua sự im lặng của chính mình.`
        },
        4: {
          theme: 'Nền móng vững — Học cách tin vào kỷ luật',
          paragraphs: [
            `Tuổi thơ và giai đoạn đầu đời mang số <strong>4</strong> của <strong>${safeName}</strong> thường gắn liền với cảm giác về <em>trách nhiệm</em> — đôi khi nặng hơn so với tuổi tác. Bạn là đứa trẻ biết gọn gàng đồ chơi sau khi chơi xong, người sẽ nhắc nhở bạn bè đến đúng giờ và thường bị coi là "già hơn tuổi". Điều này không phải vì bạn thiếu sự tinh nghịch — mà vì trong linh hồn bạn có một thứ rất thực: <strong>sự tôn trọng đối với trật tự và công bằng</strong>.`,
            `Giai đoạn nền tảng với số 4 dạy bạn giá trị của sự kiên nhẫn thông qua những trải nghiệm đòi hỏi bạn phải chờ đợi — chờ đến lượt mình, chờ kết quả của công sức bỏ ra, chờ người khác nhận ra giá trị của bạn. Những lần chờ đó không phải sự trừng phạt. Chúng đang xây dựng trong bạn một thứ mà người ta thường mất cả đời để học: <strong>niềm tin rằng nỗ lực đúng hướng cuối cùng sẽ sinh trái</strong>. Không phải ngay lập tức — nhưng chắc chắn.`,
            `Môi trường gia đình của chu kỳ này có tác động lớn đến cách bạn định nghĩa "giá trị". Nếu bạn được dạy rằng chăm chỉ là đức tính cao quý, bạn lớn lên với một cơ sở đạo đức vững chắc. Nếu bạn bị gánh nặng quá mức ngay từ nhỏ, bạn có thể mang theo nỗi lo sợ rằng mình không bao giờ <em>"làm đủ"</em>. Bài học của giai đoạn này là tìm ra ranh giới giữa kỷ luật lành mạnh và sự tự trừng phạt không cần thiết.`,
          ],
          lesson: `Số 4 trong chu kỳ đầu đời trao cho bạn thứ quý giá hơn mọi tài năng: <strong>sự kiên định</strong>. Và từ kiên định, mọi điều vĩ đại đều có thể được xây dựng.`
        },
        5: {
          theme: 'Tuổi thơ phiêu lưu — Học cách sống với sự không chắc chắn',
          paragraphs: [
            `Giai đoạn đầu đời của <strong>${safeName}</strong> với năng lượng số <strong>5</strong> thường là một bộ phim phiêu lưu đầy màu sắc — thay đổi trường học, chuyển nhà, những người bạn mới và những thử thách bất ngờ xuất hiện liên tục. Trong khi đây có thể là điều khó khăn với nhiều đứa trẻ khác, bạn — dù đôi khi khóc vì phải chia tay — lại có một khả năng kỳ lạ: <strong>thích nghi nhanh đến mức đáng ngạc nhiên</strong>. Mỗi môi trường mới là một thế giới mới để khám phá, không phải mối đe dọa.`,
            `Sự tò mò trí tuệ của bạn trong giai đoạn này là vô hạn. Bạn muốn biết tại sao bầu trời có màu xanh, tại sao người lớn lại làm những điều họ làm, và có bao nhiêu cách khác nhau để giải quyết cùng một vấn đề. Đây không phải sự xao nhãng — đây là <em>tư duy của một linh hồn đang khám phá bức tranh lớn hơn của cuộc đời</em>. Những câu hỏi bạn đặt ra ở giai đoạn này đôi khi không có câu trả lời ngay — nhưng chúng đang định hình cách bạn tiếp cận thế giới cho đến cuối cuộc đời.`,
            `Thách thức lớn nhất của chu kỳ đầu đời với số 5 là <em>tìm thấy bản sắc ổn định giữa những thay đổi liên tục</em>. Khi mọi thứ xung quanh cứ thay đổi, bạn cần học cách xác định những gì là cốt lõi không thể lay chuyển của "bạn" — không phải môi trường, không phải mối quan hệ, không phải hoàn cảnh — mà là bản thân bạn. Khi tìm được điều đó, bạn trở thành người có thể đứng vững trong bất kỳ cơn bão nào.`,
          ],
          lesson: `Giai đoạn nền tảng với số 5 dạy bạn điều quan trọng nhất: <strong>sự tự do không đến từ việc không có ràng buộc — mà đến từ việc biết chính xác bạn là ai khi mọi thứ thay đổi</strong>.`
        },
        6: {
          theme: 'Trái tim nuôi dưỡng — Học cách yêu không điều kiện',
          paragraphs: [
            `Tuổi thơ của <strong>${safeName}</strong> với số <strong>6</strong> thường gắn liền với một cảm giác rất đặc biệt: <em>cảm giác có trách nhiệm với người khác ngay từ khi còn nhỏ.</em> Bạn có thể là người anh/chị luôn nhường em, đứa con luôn để ý xem bố mẹ có vui không, người bạn luôn ở lại an ủi khi người khác buồn. Trái tim bạn to lớn đến mức đôi khi nặng hơn cơ thể nhỏ bé có thể gánh.`,
            `Gia đình là trung tâm vũ trụ của bạn trong giai đoạn này — và cách gia đình vận hành sẽ in sâu vào định nghĩa của bạn về tình yêu. Nếu bạn được lớn lên trong một môi trường ấm áp và lành mạnh, bạn mang theo mẫu hình đó và tái tạo nó ở bất kỳ nơi nào bạn đặt chân. Nếu gia đình có nhiều vết nứt, bạn thường trở thành người cố keo lại mọi thứ — đôi khi là bằng chính sức khỏe tinh thần của mình. <strong>Đây là gánh nặng mà không đứa trẻ nào đáng phải gánh một mình.</strong>`,
            `Chu kỳ đầu với số 6 đặt nền móng cho một đặc điểm sẽ theo bạn suốt đời: <em>khả năng tạo ra sự ấm áp trong bất kỳ không gian nào bạn bước vào.</em> Đây không chỉ là kỹ năng — đây là thiên phú. Nhưng để phát huy nó lành mạnh, bạn cần học từ giai đoạn này một bài học tinh vi: rằng chăm sóc người khác và chăm sóc bản thân không phải là hai lựa chọn đối lập — chúng phải đi cùng nhau.`,
          ],
          lesson: `Giai đoạn nền tảng với số 6 đang dạy bạn rằng <strong>tình yêu thực sự bắt đầu từ việc yêu bản thân đủ để không cần ai cứu bạn</strong>. Khi bạn học được điều này, bạn trở thành người có thể yêu thương mà không mất đi chính mình.`
        },
        7: {
          theme: 'Tâm hồn nội tâm — Đứa trẻ đặt câu hỏi về tất cả',
          paragraphs: [
            `Giai đoạn đầu đời của <strong>${safeName}</strong> với số <strong>7</strong> thường khá khác biệt so với những đứa trẻ cùng trang lứa. Bạn ít thích những trò chơi ầm ĩ hơn — bạn thích quan sát, suy nghĩ, và đặt câu hỏi về những thứ mà người lớn đã từ lâu ngừng thắc mắc. <em>"Tại sao mọi người lại phải chết?"</em> hay <em>"Thực sự thế giới có bắt đầu không?"</em> — đây là những câu hỏi điển hình của một đứa trẻ số 7, và không phải giáo viên hay phụ huynh nào cũng biết cách trả lời.`,
            `Sự khác biệt này đôi khi tạo ra cảm giác cô đơn. Bạn không dễ dàng hòa vào đám đông — không phải vì bạn kiêu ngạo, mà vì bạn cần sự kết nối ở chiều sâu mà ít người cùng tuổi có thể đáp ứng. Bạn thường tìm bạn trong sách, trong thiên nhiên, trong những sở thích "lạ" so với chuẩn mực. Và ở những nơi tưởng chừng cô đơn đó, bạn đang xây dựng thứ vô giá nhất của cuộc đời mình: <strong>một thế giới nội tâm phong phú và sâu sắc không ai có thể lấy đi.</strong>`,
            `Chu kỳ đầu với số 7 cũng thường mang những trải nghiệm giúp bạn học cách <em>tin vào trực giác của mình</em>. Có thể bạn biết điều gì đó "không đúng" trước khi ai kịp nhận ra. Có thể bạn cảm nhận được sự giả dối trong người lớn trước khi họ nói dối. Những khả năng nhận thức sắc bén này không phải trí tưởng tượng — đó là trực giác đang được mài sắc từng ngày.`,
          ],
          lesson: `Số 7 ở chu kỳ đầu đời trao cho bạn thứ hiếm nhất trong thế giới hiện đại: <strong>khả năng sống với những câu hỏi không có câu trả lời — và tìm thấy vẻ đẹp trong sự bí ẩn đó thay vì lo sợ nó</strong>.`
        },
        8: {
          theme: 'Sức mạnh thử lửa — Học cách đứng dậy từ thất bại đầu đời',
          paragraphs: [
            `Giai đoạn đầu đời của <strong>${safeName}</strong> với số <strong>8</strong> thường không thiếu những thách thức — đôi khi khắc nghiệt hơn so với những gì một đứa trẻ nên phải đối mặt. Có thể là những khó khăn về vật chất, có thể là sự thiếu công nhận, hoặc những tình huống đòi hỏi bạn phải mạnh mẽ khi chưa đủ lớn để hiểu tại sao. Nhưng đây chính là lò luyện thép của cuộc đời bạn — và mỗi lần vượt qua, bạn tích lũy thêm một tầng sức mạnh mà về sau sẽ trở thành vũ khí mạnh nhất của mình.`,
            `Bạn học từ rất sớm rằng thế giới không tự đến với ai — người ta phải tự mở đường. Điều này tạo ra trong bạn một <em>bản năng tự lực và tư duy chiến lược</em> đặc biệt: bạn quan sát cách thứ hoạt động, bạn học cách đọc người, và bạn phát triển khả năng nhìn thấy cơ hội trong những nơi người khác chỉ thấy vấn đề. <strong>Tư duy này không phải từ sách giáo khoa — nó đến từ những trận chiến thực sự của cuộc đời bạn.</strong>`,
            `Mối quan hệ với tiền bạc, quyền lực và uy tín được định hình mạnh mẽ trong giai đoạn đầu đời này. Nếu bạn lớn lên trong sự thiếu hụt, bạn có thể mang theo một nỗi sợ vô thức về việc trở lại trạng thái đó — một nỗi sợ có thể thúc đẩy bạn đến thành công, nhưng cũng có thể làm bạn không bao giờ cảm thấy đủ. Nhận ra và chữa lành mối quan hệ với "sự giàu có" là một trong những hành trình quan trọng nhất của số 8.`,
          ],
          lesson: `Giai đoạn nền tảng với số 8 tạo ra một điều không thể giả tạo: <strong>sức bền thực sự — loại sức bền chỉ đến từ việc đã ngã và đã đứng dậy đủ nhiều lần để biết mình có thể làm điều đó mãi mãi</strong>.`
        },
        9: {
          theme: 'Tuổi thơ với tâm hồn cổ đại — Buông bỏ để lớn lên',
          paragraphs: [
            `Giai đoạn đầu đời của <strong>${safeName}</strong> với số <strong>9</strong> thường mang theo một cảm giác kỳ lạ: <em>bạn dường như "già hơn tuổi" theo nghĩa cảm xúc và tâm linh.</em> Bạn có lòng trắc ẩn sâu sắc với những người đau khổ — ngay cả khi còn nhỏ, bạn cảm thấy đau trước sự bất công theo cách không phải ai cũng có. Và bạn thường đặt câu hỏi về ý nghĩa của những điều xung quanh — tại sao người nghèo khổ, tại sao chiến tranh, tại sao mọi thứ không công bằng hơn.`,
            `Chu kỳ đầu với số 9 thường đi kèm với những mất mát hoặc những kết thúc quan trọng — người thân qua đời, người bạn chuyển đi, ngôi trường phải chia tay, một ước mơ bị bỏ lại. Mỗi mất mát này, dù đau, đang dạy bạn bài học tinh tế nhất mà số 9 cần học: <strong>sự buông bỏ không phải là thất bại — đó là bước đầu tiên của sự tự do.</strong> Khi bạn học cách không bám víu vào những gì đã qua, bạn tạo ra không gian cho điều lớn hơn bước vào.`,
            `Lòng vị tha của bạn trong giai đoạn này có thể đôi khi khiến bạn bỏ qua nhu cầu của chính mình. Bạn yêu quá rộng — và điều đó đẹp. Nhưng nếu không học cách yêu bản thân với cùng sự rộng lượng đó, bạn sẽ mang theo một vết thương ẩn trong suốt cuộc đời: cảm giác rằng mình chỉ có giá trị khi phục vụ người khác. <em>Đây là vết thương cần được nhìn thấy và chữa lành.</em>`,
          ],
          lesson: `Số 9 trong chu kỳ đầu đời hứa hẹn điều này: <strong>mọi điều bạn mất trong giai đoạn này đều đang dọn dọn chỗ cho điều lớn hơn mà bạn chưa thể thấy từ vị trí hiện tại</strong>. Hãy tin vào quá trình.`
        },
        11: {
          theme: 'Linh hồn nhạy cảm — Trưởng thành giữa hai thế giới',
          paragraphs: [
            `Tuổi thơ của <strong>${safeName}</strong> với số chủ <strong>11</strong> thường là một hành trình đặc biệt và không dễ dàng. Bạn cảm nhận mọi thứ ở một chiều sâu mà người xung quanh — kể cả bố mẹ — đôi khi không thể hiểu được. Bạn có thể biết ai đó đang buồn hoặc đang có ý định không tốt chỉ bằng trực giác. Bạn có những giấc mơ sống động, những linh cảm chính xác một cách khó lý giải, và đôi khi cảm thấy như mình nhìn thấy thứ gì đó mà người khác không thấy. Điều này có thể rất cô đơn.`,
            `Giai đoạn đầu đời với số 11 thường đi kèm với <em>sự nhạy cảm cực cao</em> — bạn hấp thụ năng lượng của môi trường xung quanh như miếng bọt biển, đặc biệt là những căng thẳng và xung đột trong gia đình. Bạn có thể bị lo âu, mất ngủ, hoặc có những phản ứng cảm xúc mạnh mẽ với những sự kiện mà người khác thấy bình thường. Đây không phải sự yếu đuối — <strong>đây là dấu hiệu của một hệ thống cảm nhận đặc biệt đang phát triển</strong>. Bạn cần được bảo vệ và nuôi dưỡng, không phải bị bảo là "đừng nhạy cảm quá".`,
            `Sứ mệnh lớn nhất của chu kỳ đầu đời với số 11 là <em>học cách sống với hai thế giới song song</em>: thế giới vật chất hàng ngày và thế giới nội tâm phong phú với những nhận thức tinh tế. Những đứa trẻ số 11 thường tìm được chỗ trú trong nghệ thuật, âm nhạc, văn chương — bất cứ thứ gì cho phép chuyển hóa những gì cảm nhận được thành hình thức có thể chia sẻ. Đây là cách số 11 sinh tồn và phát triển trong thế giới vật chất.`,
          ],
          lesson: `Giai đoạn đầu đời trao cho số 11 thứ quý giá nhất: <strong>chiều sâu cảm xúc và trực giác được mài sắc qua những khó khăn — và đây chính là nguồn sức mạnh cho sứ mệnh mà bạn mang theo suốt cuộc đời</strong>.`
        },
        22: {
          theme: 'Nền tảng vĩ đại — Học cách mang theo tầm nhìn',
          paragraphs: [
            `Tuổi thơ của <strong>${safeName}</strong> với số chủ <strong>22</strong> thường đặc biệt hơn những gì hoàn cảnh bề ngoài phản ánh. Bạn có những ý tưởng vượt xa độ tuổi — những kế hoạch, những giấc mơ về điều gì đó lớn hơn bình thường, và một cảm giác thầm lặng rằng mình được sinh ra để làm điều gì đó quan trọng mà chưa biết chính xác là gì. Đôi khi điều này làm bạn thất vọng với những gì đang có. Đôi khi nó là ngọn lửa bí mật giữ bạn tiến về phía trước.`,
            `Giai đoạn nền tảng với số 22 thường đòi hỏi bạn phát triển hai phẩm chất song song: <em>sự mơ mộng về những điều có thể và sự thực tế về cách làm điều đó thành hiện thực.</em> Số 22 là sự kết hợp của trực giác số 11 và kỷ luật số 4 — và trong giai đoạn đầu đời, bạn đang học cách tích hợp cả hai. Đây là bài học khó: làm sao để không đánh mất tầm nhìn khi đối mặt với thực tế, và không đánh mất thực tế khi bị cuốn theo tầm nhìn.`,
            `Những thách thức trong tuổi thơ của số 22 thường lớn hơn mức trung bình — như thể vũ trụ đang kiểm tra xem bạn có đủ sức mạnh để gánh vác những gì về sau sẽ được trao. <strong>Mỗi khó khăn bạn vượt qua trong giai đoạn này không chỉ rèn luyện cá nhân bạn — nó đang chuẩn bị cho bạn khả năng hiểu và dẫn dắt người khác qua những khó khăn tương tự.</strong>`,
          ],
          lesson: `Chu kỳ đầu của số 22 trao cho bạn điều không trường lớp nào có thể dạy: <strong>sự khôn ngoan thực tiễn đến từ việc đã sống qua đủ điều để biết rằng những gì lớn nhất đều được xây từ những nền tảng nhỏ bé và kiên nhẫn nhất</strong>.`
        },
      },

      // ══════════ CHU KỲ 2 — XÂY DỰNG (TRƯỞNG THÀNH) ══════════
      2: {
        1: {
          theme: 'Thời kỳ định hình — Biến ý chí thành di sản',
          paragraphs: [
            `Giai đoạn trưởng thành của <strong>${safeName}</strong> với năng lượng số <strong>1</strong> là thời kỳ của hàng triệu quyết định — mỗi ngày, mỗi giờ — định hình nên con người bạn sẽ trở thành. Đây không phải giai đoạn "thử nghiệm" như tuổi thơ. Đây là sân chơi thực sự, với tiền thật, mối quan hệ thật và hậu quả thật. Năng lượng số 1 trong chu kỳ này thúc bạn đến phía trước với tốc độ mà đôi khi chính bạn cũng ngạc nhiên — nhưng đây là lúc thiên phú lãnh đạo của bạn cần được biểu hiện, không phải chờ đợi.`,
            `Sự nghiệp và tầm ảnh hưởng là những chủ đề trung tâm. Bạn không hài lòng với việc là người thực hiện — bạn muốn là người định hướng. <em>Bạn có ý kiến về cách mọi thứ nên được làm, và thường bạn đúng hơn người ta nghĩ.</em> Thách thức là học cách biến sự quyết đoán này thành sức hút, không phải xung đột. Người lãnh đạo giỏi nhất không phải là người to tiếng nhất — mà là người khiến người khác muốn đi theo vì họ tin tưởng tầm nhìn đó.`,
            `Trong tình yêu và các mối quan hệ, giai đoạn này đặt ra câu hỏi quan trọng: <strong>bạn muốn đồng hành hay muốn người đi theo?</strong> Số 1 trong chu kỳ 2 cần học cách xây dựng mối quan hệ giữa hai người bình đẳng — không phải người dẫn và kẻ theo, không phải người quyết định và kẻ chấp nhận. Khi bạn tìm được người đủ mạnh để đứng cạnh chứ không đứng sau bạn, mối quan hệ đó sẽ là nền tảng của sức mạnh lớn nhất bạn từng có.`,
          ],
          lesson: `Thời kỳ xây dựng với số 1 dạy bạn rằng <strong>lãnh đạo thực sự không phải là đứng trên người khác — mà là đứng trước họ, chỉ đường và chịu trách nhiệm về những gì xảy ra sau lưng mình</strong>.`
        },
        2: {
          theme: 'Thời kỳ kết nối — Xây dựng những mối quan hệ thay đổi tất cả',
          paragraphs: [
            `Giai đoạn trưởng thành của <strong>${safeName}</strong> với năng lượng số <strong>2</strong> đặt con người lên trung tâm của mọi thứ. Đây là thời kỳ bạn nhận ra rằng <em>không ai có thể thực sự thành công một mình</em> — và sức mạnh thực sự của bạn không nằm ở việc làm mọi thứ một mình, mà ở khả năng xây dựng những liên minh, đối tác và mạng lưới tin tưởng đủ mạnh để nâng đỡ những mục tiêu lớn hơn bản thân.`,
            `Trong sự nghiệp, bạn thường tỏa sáng nhất ở vai trò mà người khác hay bỏ qua: người xây dựng đồng thuận, người hòa giải trong xung đột, người giữ mọi thứ không vỡ ra khi căng thẳng leo thang. <strong>Đóng góp thầm lặng nhất thường là đóng góp không thể thay thế nhất</strong> — và bạn là người hiểu điều này sâu sắc nhất. Hãy học cách đánh giá cao vai trò này của chính mình thay vì so sánh với những người ồn ào hơn.`,
            `Tình yêu và gia đình trong giai đoạn này thường chiếm vị trí quan trọng hơn hầu hết mọi thứ khác. Bạn đầu tư vào mối quan hệ bằng cả trái tim — và khi được đáp lại xứng đáng, bạn nở rộ theo những cách mà không ai ngoài người thân cận mới có thể nhận ra. Khi không được đáp lại, bạn có thể tàn héo trong im lặng. Bài học quan trọng nhất: <em>học cách nói ra những gì bạn cần trước khi nó trở thành vết thương không lành.</em>`,
          ],
          lesson: `Chu kỳ xây dựng với số 2 hứa hẹn điều này: <strong>những mối quan hệ bạn nuôi dưỡng trong giai đoạn này — bằng sự kiên nhẫn, sự lắng nghe và lòng chân thành — sẽ trở thành tài sản quý giá nhất của cuộc đời bạn</strong>.`
        },
        3: {
          theme: 'Mùa bứt phá sáng tạo — Tìm thấy tiếng nói của mình',
          paragraphs: [
            `Giai đoạn trưởng thành với số <strong>3</strong> là mùa bứt phá sáng tạo của <strong>${safeName}</strong>. Bạn giỏi nhất trong những lĩnh vực đòi hỏi ý tưởng và biểu đạt — viết, nói, thiết kế, giảng dạy, diễn xuất. Đây cũng là giai đoạn cần rèn thêm kỷ luật để hoàn thành những gì đã bắt đầu, tránh để tài năng rơi vào sự tản mạn.`,
            `Trong sự nghiệp, bạn tỏa sáng ở những nơi cần sự sáng tạo và kết nối con người. Bạn là người mang năng lượng vào phòng, người làm cho ý tưởng trở nên sống động và dễ hiểu hơn. Nhưng giai đoạn này cũng đòi hỏi bạn học cách <em>biến tài năng thành sản phẩm có giá trị thực tế</em> — không chỉ những buổi trình bày hay những ý tưởng đầy hứa hẹn, mà là những thứ hoàn chỉnh và tạo ra tác động thực.`,
            `Cuộc sống xã hội và tình yêu trong giai đoạn này phong phú và đôi khi hỗn độn. Bạn kết bạn dễ dàng — và đôi khi kết yêu cũng dễ dàng không kém. Thách thức là tìm ra người thực sự xứng đáng với sự đầu tư cảm xúc sâu hơn của bạn, không chỉ là những người mang lại sự phấn khích nhất thời. <strong>Chiều sâu của mối quan hệ đến không phải từ những người hấp dẫn nhất — mà từ những người ở lại khi sự phấn khích qua đi.</strong>`,
          ],
          lesson: `Giai đoạn xây dựng với số 3 dạy bạn điều quan trọng nhất: <strong>tài năng là hạt giống, nhưng kỷ luật mới là nước tưới — và chỉ khi kết hợp cả hai, những điều thực sự vĩ đại mới có thể nở rộ</strong>.`
        },
        4: {
          theme: 'Thời kỳ tích lũy — Những nền tảng được xây trong yên lặng',
          paragraphs: [
            `Giai đoạn trưởng thành của <strong>${safeName}</strong> với số <strong>4</strong> không phải giai đoạn hào nhoáng nhất — nhưng chắc chắn là giai đoạn quan trọng nhất. Đây là thời kỳ những quyết định đúng đắn được đưa ra không phải vì cảm hứng nhất thời mà vì sự tính toán kỹ lưỡng và kỷ luật bền bỉ. Mỗi thứ bạn xây trong giai đoạn này — sự nghiệp, tài chính, gia đình, thói quen — đều đang tạo nên nền móng cho những điều lớn hơn bạn sẽ đạt được trong giai đoạn sau.`,
            `Trong sự nghiệp, bạn nổi bật không phải vì sự hào phóng hay sự lôi cuốn — mà vì sự đáng tin cậy. <em>Bạn nói là làm, hứa là giữ</em>, và điều đó trong dài hạn xây dựng được uy tín mà không kỹ năng thuyết trình nào có thể tạo ra. Hãy kiên nhẫn — thành công của số 4 thường đến muộn hơn một chút so với những con số ồn ào hơn, nhưng khi đến, nó bền vững theo cách không gì có thể lung lay.`,
            `Trong gia đình và tình yêu, bạn là người xây dựng tổ ấm — không chỉ theo nghĩa đen, mà theo nghĩa cảm xúc. <strong>Bạn là người mà người thân biết họ có thể tin tưởng khi mọi thứ không ổn.</strong> Thách thức của giai đoạn này là tìm cách bảo vệ thời gian và năng lượng cho bản thân trong khi vẫn đáp ứng những trách nhiệm bạn coi là thiêng liêng. Kỷ luật với bản thân cũng cần thiết trong việc tự chăm sóc.`,
          ],
          lesson: `Chu kỳ xây dựng với số 4 hứa hẹn điều này: <strong>thứ bạn xây được trong giai đoạn im lặng này — từng viên gạch, từng thói quen, từng cam kết được giữ — sẽ là nền tảng mà cả phần còn lại của cuộc đời bạn đứng vững trên đó</strong>.`
        },
        5: {
          theme: 'Thời kỳ bứt phá — Những cánh cửa mới và những góc rẽ bất ngờ',
          paragraphs: [
            `Giai đoạn trưởng thành của <strong>${safeName}</strong> với số <strong>5</strong> thường là một bộ phim hành động nhiều tình tiết — thay đổi nghề nghiệp, di chuyển địa lý, những mối quan hệ bất ngờ và những cơ hội không ai tiên liệu được. Điều này có thể gây ra cảm giác không ổn định với người xung quanh, nhưng với bạn — khi được sống đúng với năng lượng số 5 — đây chính xác là cách cuộc đời nên vận hành. <em>Sự thay đổi không phải là kẻ thù của bạn. Đó là cách bạn tiến hóa.</em>`,
            `Trong sự nghiệp, bạn thường không phù hợp với những công việc tẻ nhạt và lặp đi lặp lại. Bạn cần sự đa dạng — cần được học những thứ mới, gặp những người mới và đối mặt với những thách thức không giống những gì đã qua. Những vị trí lý tưởng cho số 5 trong giai đoạn này là những nơi đòi hỏi sự linh hoạt và khả năng thích nghi: truyền thông, kinh doanh quốc tế, bán hàng, tư vấn, du lịch. <strong>Xem sự thay đổi nghề nghiệp như một chiến lược, không phải thất bại</strong> — đó là cách số 5 tiếp cận thị trường lao động khôn ngoan nhất.`,
            `Tình yêu và các mối quan hệ trong giai đoạn này thường phức tạp hơn những gì bạn dự tính. Bạn muốn tự do — nhưng cũng muốn kết nối thực sự. Hai điều này không phải mâu thuẫn, nhưng cần sự khéo léo để cân bằng. <em>Người bạn đời lý tưởng trong giai đoạn này không phải người giống bạn — mà là người đủ vững chắc để bạn có thể trở về sau mỗi chuyến phiêu lưu, nhưng cũng đủ tự do để không cố giam giữ bạn.</em>`,
          ],
          lesson: `Giai đoạn xây dựng với số 5 trao cho bạn thứ không thể học từ sách: <strong>khả năng điều hướng sự không chắc chắn với sự duyên dáng — không phải vì bạn không sợ, mà vì bạn đã quen đủ với sự thay đổi để biết rằng bạn luôn có thể tìm thấy con đường của mình</strong>.`
        },
        6: {
          theme: 'Thời kỳ gánh vác — Học cách yêu mà không mất mình',
          paragraphs: [
            `Giai đoạn trưởng thành của <strong>${safeName}</strong> với số <strong>6</strong> thường đặt nặng lên vai bạn những trách nhiệm thiêng liêng nhất — gia đình, con cái, cha mẹ già, cộng đồng. Đây là giai đoạn bạn trở thành <em>nơi nương tựa cho những người bạn yêu thương</em>, và điều đó vừa đẹp vừa nặng nề theo cách mà không ai ngoài bạn có thể hiểu hoàn toàn.`,
            `Trong sự nghiệp, bạn thường bị thu hút đến những lĩnh vực liên quan đến phục vụ và nuôi dưỡng: giáo dục, y tế, tư vấn, thiết kế không gian sống, nghệ thuật. Bạn làm tốt nhất khi công việc của mình có ý nghĩa rõ ràng với người khác — khi bạn có thể nhìn thấy tác động của mình trong cuộc sống của những người bạn phục vụ. <strong>Đừng để áp lực xã hội định nghĩa "thành công" theo những tiêu chuẩn không phù hợp với bản chất của bạn.</strong>`,
            `Thách thức lớn nhất của chu kỳ này là <em>ranh giới</em>. Bạn muốn giúp — nhưng không phải ai nhận sự giúp đỡ của bạn đều sử dụng nó đúng cách. Không phải mọi người đều xứng đáng với mức độ hy sinh mà bạn sẵn sàng thực hiện. Học cách phân biệt ai thực sự cần bạn và ai chỉ đang tiêu tốn năng lượng của bạn là bài học tối quan trọng của giai đoạn này — và nó cần được học trước khi bạn kiệt sức.`,
          ],
          lesson: `Giai đoạn xây dựng với số 6 dạy bạn điều không dễ nhưng cần thiết: <strong>tình yêu thương bền vững nhất không phải là tình yêu hy sinh tất cả — mà là tình yêu đến từ sự sung mãn của một trái tim cũng được yêu thương và chăm sóc đủ đầy</strong>.`
        },
        7: {
          theme: 'Thời kỳ đào sâu — Trở thành chuyên gia và nhà tư tưởng',
          paragraphs: [
            `Giai đoạn trưởng thành của <strong>${safeName}</strong> với số <strong>7</strong> là thời kỳ của sự tích lũy tri thức và chuyên môn sâu. Bạn không hài lòng với sự hiểu biết bề mặt — bạn muốn <em>hiểu thực sự</em>, muốn đi đến tận cùng của mỗi câu hỏi, muốn trở thành người mà người khác tìm đến khi họ cần sự thật thay vì sự an ủi. Đây là giai đoạn bạn xây dựng uy quyền tri thức theo nghĩa sâu sắc nhất.`,
            `Trong sự nghiệp, bạn thường xuất sắc nhất ở những lĩnh vực đòi hỏi sự tập trung dài hạn và tư duy phân tích: nghiên cứu, khoa học, tư vấn chiến lược, triết học, tâm lý học, công nghệ. Bạn không cần đám đông để thăng hoa — bạn cần sự yên tĩnh và không gian để tư duy. <strong>Hãy bảo vệ điều kiện làm việc này như một điều kiện sống còn, không phải đặc quyền.</strong>`,
            `Trong các mối quan hệ, giai đoạn này đòi hỏi bạn học cách <em>chia sẻ thế giới nội tâm phong phú của mình một cách có chọn lọc</em>. Bạn không cần phải mở lòng với tất cả mọi người — nhưng bạn cần ít nhất một hay hai người thực sự được phép bước vào. Sự cô đơn có chọn lọc là lành mạnh. Sự cô lập vì sợ hãi thì không — và bạn cần thành thật với bản thân về sự khác biệt này.`,
          ],
          lesson: `Giai đoạn xây dựng với số 7 tạo ra điều thế giới thực sự cần: <strong>những con người đã đủ dũng cảm để đi sâu — vào tri thức, vào bản thân, vào sự thật khó chịu — và có thể trở về với những hiểu biết mà người khác không thể đến được nếu không có người dẫn đường như bạn</strong>.`
        },
        8: {
          theme: 'Thời kỳ quyền lực — Thu hoạch những gì đã gieo',
          paragraphs: [
            `Giai đoạn trưởng thành của <strong>${safeName}</strong> với số <strong>8</strong> là thời kỳ mà những nỗ lực tích lũy từ trước bắt đầu sinh trái. Tài chính, địa vị, ảnh hưởng — những thứ này không đến ngẫu nhiên với số 8. Chúng đến như kết quả trực tiếp của sự kỷ luật, tầm nhìn chiến lược và khả năng không bỏ cuộc khi người khác đã từ bỏ lâu rồi. <em>Đây là giai đoạn để thu hoạch — nhưng cũng là giai đoạn để định nghĩa lại thành công bằng những tiêu chuẩn sâu sắc hơn tiền bạc và địa vị.</em>`,
            `Trong sự nghiệp, bạn thường ở vị trí lãnh đạo — chính thức hoặc không chính thức. Người ta tìm đến bạn để đưa ra quyết định, để xử lý tình huống khó, để tạo ra kết quả khi áp lực cao nhất. <strong>Bạn không nên từ chối vai trò này — nhưng bạn cần học cách không để nó tiêu hóa mọi phần khác của cuộc đời mình.</strong> Thành công mà cái giá là mất đi sức khỏe, gia đình hay sự bình an nội tâm không phải thành công — đó là sự trao đổi không cân xứng.`,
            `Sự thịnh vượng vật chất trong giai đoạn này cũng thường đi kèm với những bài kiểm tra về lòng chính trực: cơ hội cắt góc, những mối quan hệ chỉ vì lợi ích, những quyết định giữa cái gì đúng và cái gì có lợi. <em>Cách bạn đối diện với những bài kiểm tra này sẽ định hình di sản thực sự của bạn</em> — không phải con số tài khoản ngân hàng.`,
          ],
          lesson: `Giai đoạn xây dựng với số 8 dạy bạn bài học sâu sắc nhất về quyền lực: <strong>quyền lực thực sự không phải là khả năng kiểm soát người khác — mà là sự làm chủ đối với chính mình, ngay cả khi bạn có đủ sức để không cần làm vậy</strong>.`
        },
        9: {
          theme: 'Thời kỳ cống hiến — Mở rộng tình yêu ra thế giới',
          paragraphs: [
            `Giai đoạn trưởng thành của <strong>${safeName}</strong> với số <strong>9</strong> thường là thời kỳ mà bạn nhận ra một sự thật lớn: <em>những mục tiêu cá nhân đơn thuần không còn đủ khiến bạn bừng sáng.</em> Bạn cần điều gì đó lớn hơn bản thân — một sứ mệnh, một cộng đồng, một đóng góp có thể cảm nhận được trong thế giới rộng hơn bốn bức tường của cuộc đời riêng. Đây không phải ảo tưởng — đây là bản năng linh hồn của số 9 đang tự khẳng định.`,
            `Trong sự nghiệp, bạn thường bị thu hút đến những lĩnh vực có tác động xã hội rõ ràng: từ thiện, giáo dục, y tế, nghệ thuật có tầm ảnh hưởng, hoạt động cộng đồng. Nhưng ngay cả trong những ngành nghề bình thường, bạn tìm cách làm cho công việc của mình có ý nghĩa hơn — <strong>bằng cách chú ý đến con người đằng sau công việc, không chỉ kết quả của nó.</strong>`,
            `Giai đoạn này cũng thường đem đến những mất mát lớn — chia tay, kết thúc, những điều bạn yêu quý phải để lại phía sau. Số 9 ở chu kỳ 2 đang dạy bạn bài học thiêng liêng nhất: <em>buông bỏ không phải là từ bỏ — đó là hành động yêu thương sâu sắc nhất</em>, khi bạn nhận ra rằng giữ lấy đôi khi gây hại nhiều hơn là để đi.`,
          ],
          lesson: `Chu kỳ xây dựng với số 9 hứa hẹn điều này: <strong>khi bạn dám sống vì điều gì đó lớn hơn bản thân, cuộc đời bạn không trở nên nhỏ bé hơn — mà trở nên lớn hơn gấp nhiều lần theo những cách mà bạn sẽ chỉ hiểu khi nhìn lại về sau</strong>.`
        },
        11: {
          theme: 'Thời kỳ thức tỉnh — Sứ mệnh tâm linh bắt đầu hiện rõ',
          paragraphs: [
            `Giai đoạn trưởng thành của <strong>${safeName}</strong> với số chủ <strong>11</strong> thường mang theo một sự thức tỉnh — đôi khi từ từ, đôi khi đột ngột — về thứ mà bạn thực sự được sinh ra để làm. Đây là giai đoạn mà trực giác của bạn trở nên không thể phủ nhận: những linh cảm chính xác đến mức đáng sợ, những kết nối vô hình mà bạn bắt đầu học cách tin tưởng thay vì gạt đi. <em>Thế giới bên ngoài không cần biết điều bạn biết — bạn chỉ cần học cách hành động theo nó.</em>`,
            `Trong sự nghiệp, số 11 ở giai đoạn này thường tìm được con đường của mình ở những lĩnh vực kết hợp sự sáng tạo và tầm nhìn tâm linh: nghệ thuật, âm nhạc, viết lách, tư vấn tâm lý, giáo dục có chiều sâu, các phong trào xã hội. Bạn không phù hợp với những cấu trúc cứng nhắc — và sự nghiệp lý tưởng của bạn thường là những gì bạn tự tạo ra, không phải những gì ai đó thiết kế sẵn cho bạn.`,
            `Thách thức lớn nhất của giai đoạn này là <strong>học cách chuyển hóa sự nhạy cảm thành sức mạnh thay vì gánh nặng</strong>. Bạn cảm thấy nhiều — nhưng bạn cũng có thể bị kiệt sức vì hoàn cảnh và con người xung quanh nếu không học cách bảo vệ năng lượng của mình. Ranh giới không phải là bức tường — đó là sự bảo vệ thiêng liêng cho món quà mà bạn được trao để chia sẻ với thế giới.`,
          ],
          lesson: `Giai đoạn xây dựng với số 11 định nghĩa rõ nhất sứ mệnh của bạn: <strong>không phải để cứu vớt mọi người, mà để tỏa ánh sáng đúng thời điểm, đúng nơi, với đúng những người có thể nhận và biến nó thành điều gì đó tốt đẹp hơn cho thế giới này</strong>.`
        },
        22: {
          theme: 'Thời kỳ xây dựng di sản — Biến tầm nhìn thành hiện thực',
          paragraphs: [
            `Giai đoạn trưởng thành của <strong>${safeName}</strong> với số chủ <strong>22</strong> là thời kỳ mà tầm nhìn lớn bắt đầu gặp được những công cụ thực tế để hiện thực hóa. Đây là giai đoạn của những dự án quy mô vượt xa cá nhân — những thứ bạn xây dựng không chỉ cho bản thân mà cho nhiều người, không chỉ cho hôm nay mà cho nhiều năm về sau. <em>Cảm giác "phải làm điều gì đó lớn hơn" không còn là mơ hồ — nó trở thành kế hoạch cụ thể với những bước rõ ràng.</em>`,
            `Trong sự nghiệp, số 22 ở giai đoạn này thường ở vị trí kỳ lạ: bạn nhìn thấy những điều mà người khác chưa thấy, nhưng bạn cũng phải làm việc với thực tế mà người khác đang phải sống. Sự kết hợp giữa tầm nhìn tâm linh và kỷ luật thực tế — hai yếu tố cốt lõi của số 22 — phải được cân bằng liên tục. <strong>Những người vĩ đại nhất không phải những người chỉ mơ giỏi, cũng không phải những người chỉ thực thi giỏi — mà là những người làm được cả hai một lúc.</strong>`,
            `Áp lực trong giai đoạn này rất lớn — từ bên ngoài và từ bên trong. Từ bên ngoài, người ta kỳ vọng nhiều ở bạn. Từ bên trong, bạn kỳ vọng nhiều ở chính mình hơn bất kỳ ai. Học cách chia nhỏ tầm nhìn lớn thành những bước có thể thực hiện được từng ngày — đó là kỹ năng tối quan trọng. <em>Vĩ đại không được xây trong một ngày. Nó được xây từng viên gạch — với sự kiên nhẫn mà người từ bên ngoài không thể thấy.</em>`,
          ],
          lesson: `Chu kỳ xây dựng với số 22 hứa hẹn: <strong>khi bạn kiên trì với tầm nhìn của mình qua những năm tháng khó khăn và đôi khi cô đơn, thứ bạn tạo ra cuối cùng sẽ không chỉ thay đổi cuộc đời bạn — mà sẽ là điều mà nhiều người khác nhìn vào và tìm thấy can đảm để bắt đầu hành trình của chính họ</strong>.`
        },
      },

      // ══════════ CHU KỲ 3 — THU HOẠCH (VIÊN MÃN) ══════════
      3: {
        1: {
          theme: 'Viên mãn trong độc lập — Sống đúng với chính mình không cần chứng minh',
          paragraphs: [
            `Giai đoạn viên mãn của <strong>${safeName}</strong> với số <strong>1</strong> mang theo một sự tự do đặc biệt: <em>bạn không còn cần phải chứng minh mình là ai với bất kỳ ai.</em> Những năm tháng đầu đời tranh đấu để được nhìn nhận, những năm trưởng thành cố gắng khẳng định vị trí — tất cả đã qua. Giai đoạn này trao cho bạn đặc quyền quý giá nhất mà con người có thể có: sự tự do để sống hoàn toàn theo những gì bạn thực sự muốn, không phải những gì người khác kỳ vọng.`,
            `Đây là giai đoạn nhiều người mang số 1 thực sự bắt đầu tỏa sáng theo cách riêng — không phải vì họ đã cố gắng hơn, mà vì họ đã ngừng cố gắng chứng minh và bắt đầu <em>đơn giản là tồn tại</em> trong sức mạnh của chính mình. Những người xung quanh cảm nhận được sự khác biệt này — có một thứ gì đó ổn định, chắc chắn và chân thực trong bạn mà những năm trước chưa có.`,
            `Đóng góp của bạn trong giai đoạn này thường là sự chia sẻ kinh nghiệm và tầm nhìn — không phải qua việc lãnh đạo như trước, mà qua việc trở thành <strong>tấm gương sáng về điều có thể đạt được khi một người dám sống đúng với bản thân mình.</strong> Những người trẻ hơn nhìn vào bạn và thấy rằng họ không cần phải thu nhỏ bản thân để được chấp nhận — và đó là đóng góp lớn hơn nhiều so với bất kỳ thành tích nào.`,
          ],
          lesson: `Giai đoạn thu hoạch với số 1 là bằng chứng sống của một sự thật đơn giản: <strong>con người tự do nhất không phải là người không có ràng buộc — mà là người đã biết đủ về bản thân mình để không cần bất kỳ sự chấp thuận nào từ bên ngoài để cảm thấy trọn vẹn</strong>.`
        },
        2: {
          theme: 'Viên mãn trong kết nối — Tình yêu và sự trân trọng',
          paragraphs: [
            `Giai đoạn viên mãn của <strong>${safeName}</strong> với số <strong>2</strong> là thời kỳ đẹp nhất của những kết nối. Những mối quan hệ bạn đã đầu tư qua nhiều thập kỷ — tình bạn, gia đình, tình yêu — giờ mang lại những trái ngọt ngào theo cách mà bạn đã từng hy vọng nhưng chưa dám chắc. <em>Sự kiên nhẫn và lòng chân thành mà bạn đã gieo suốt cuộc đời đang trở về với bạn theo những hình thức đẹp đẽ nhất.</em>`,
            `Vai trò của bạn trong giai đoạn này thường chuyển từ người xây dựng kết nối sang <em>người gìn giữ và nuôi dưỡng những kết nối đó</em>. Bạn là người mà cả gia đình quay về, là người mà bạn bè tin tưởng chia sẻ những điều chưa nói với ai, là người mà cộng đồng nhỏ của bạn biết rằng sẽ luôn được chào đón ấm áp. Đây không phải vai trò nhỏ — đây là loại ảnh hưởng mà ít người có thể tạo ra.`,
            `Giai đoạn này cũng là thời điểm để bạn học cách <strong>nhận sự quan tâm với cùng vẻ duyên dáng mà bạn đã cho đi cả đời</strong>. Nếu bạn luôn là người chăm sóc, việc chấp nhận sự chăm sóc lại có thể cảm thấy kỳ lạ. Nhưng đây là bài học cuối cùng và đẹp nhất của số 2 — rằng yêu thương thực sự chảy theo hai chiều, và cho phép mình được yêu là một hành động dũng cảm và tuyệt đẹp.`,
          ],
          lesson: `Giai đoạn thu hoạch với số 2 trao cho bạn điều quý giá nhất: <strong>sự hiểu biết sâu sắc rằng cuộc đời đẹp nhất không phải là cuộc đời nhiều thành tích — mà là cuộc đời nhiều tình yêu thương thực sự được trao và được nhận theo cả hai chiều</strong>.`
        },
        3: {
          theme: 'Viên mãn trong sáng tạo — Di sản của những câu chuyện được kể',
          paragraphs: [
            `Giai đoạn viên mãn của <strong>${safeName}</strong> với số <strong>3</strong> thường là giai đoạn sáng tạo đỉnh cao — không phải vì kỹ thuật đỉnh cao (dù có thể vậy), mà vì <em>sự chân thực đỉnh cao.</em> Những gì bạn tạo ra trong giai đoạn này — dù là văn chương, âm nhạc, nghệ thuật, hay đơn giản là những câu chuyện bạn kể cho người yêu thương — đều mang theo chiều sâu của một người đã sống đủ lâu để biết điều gì thực sự quan trọng.`,
            `Bạn trở thành người kể chuyện của thế hệ mình — <strong>không phải vì bạn có câu chuyện hay nhất, mà vì bạn biết cách làm cho mọi câu chuyện trở thành thứ gì đó người khác có thể nhìn vào và thấy chính mình trong đó.</strong> Đây là món quà đặc biệt của số 3 ở giai đoạn viên mãn — không còn kể chuyện để được chú ý, mà kể chuyện để kết nối người với người qua những sự thật chung của con người.`,
            `Niềm vui vẫn là ngôn ngữ cốt lõi của bạn — nhưng giờ nó có thêm chiều sâu của người đã biết rằng niềm vui không phải là sự né tránh thực tế mà là cách chọn sống trong thực tế đó. <em>Sự vui vẻ của bạn trong giai đoạn này không phải vì cuộc sống hoàn hảo — mà vì bạn đã đủ khôn ngoan để nhận ra sự hoàn hảo trong những điều không hoàn hảo.</em>`,
          ],
          lesson: `Giai đoạn thu hoạch với số 3 để lại di sản đẹp nhất: <strong>những câu chuyện, những tác phẩm và những khoảnh khắc vui vẻ mà bạn đã tạo ra và chia sẻ — chúng sẽ sống trong ký ức của những người được chúng chạm đến, lâu hơn nhiều so với bất kỳ thứ vật chất nào bạn có thể để lại</strong>.`
        },
        4: {
          theme: 'Viên mãn trong bền vững — Nhìn lại những điều đã xây',
          paragraphs: [
            `Giai đoạn viên mãn của <strong>${safeName}</strong> với số <strong>4</strong> trao cho bạn một đặc quyền hiếm có: <em>khả năng nhìn lại và thấy rằng những gì bạn đã xây cẩn thận, kiên nhẫn qua nhiều thập kỷ đã đứng vững.</em> Không phải ai cũng có được sự thỏa mãn này — nhiều người dành cả đời xây những tòa lâu đài trên cát. Nhưng bạn, với kỷ luật và sự kiên định của số 4, đã xây trên đá — và giờ bạn có thể đứng trên nền móng đó và nhìn thấy những gì không gì có thể lung lay.`,
            `Gia đình và những mối quan hệ lâu bền là niềm vui lớn nhất của giai đoạn này. <strong>Sự trung thành và kiên định mà bạn đã thể hiện trong nhiều thập kỷ đã tạo ra những mối kết nối sâu và bền vững mà người đi đường tắt không bao giờ có được.</strong> Đây là thứ không thể mua bằng tiền hay đạt được bằng sự hào nhoáng — nó chỉ đến từ năm tháng của sự xuất hiện đáng tin cậy.`,
            `Giai đoạn này cũng là lúc để buông bỏ sự kiểm soát — một cách nhẹ nhàng và tự nguyện. <em>Đời cần bạn làm kiến trúc sư ít hơn và làm người thưởng thức nhiều hơn.</em> Hãy học cách để những thế hệ sau tiếp quản những gì bạn đã xây, tin rằng nền móng bạn đặt đủ vững để họ có thể phát triển trên đó theo những cách bạn chưa tưởng tượng đến.`,
          ],
          lesson: `Giai đoạn thu hoạch với số 4 xác nhận sự thật lớn nhất của cuộc đời bạn: <strong>không phải những thứ lớn lao và hào nhoáng tạo nên ý nghĩa — mà là những thứ nhỏ bé nhưng bền vững, được xây bằng tình yêu và kỷ luật qua từng ngày bình thường của cuộc sống</strong>.`
        },
        5: {
          theme: 'Viên mãn trong tự do — Sống phiêu lưu không cần xin phép',
          paragraphs: [
            `Giai đoạn viên mãn của <strong>${safeName}</strong> với số <strong>5</strong> thường là giai đoạn bùng phát bất ngờ — khi nhiều người khác bắt đầu chậm lại, bạn lại tìm thấy thêm năng lượng mới. Những kế hoạch từng bị hoãn lại vì trách nhiệm giờ có thể được thực hiện. Những ước mơ từng bị đặt sang một bên vì "chưa đúng lúc" giờ đã đến lúc — và thứ đặc biệt là bạn <em>biết cách thực hiện chúng với sự khôn ngoan mà tuổi trẻ không có.</em>`,
            `Đây là giai đoạn mà sự tò mò trí tuệ của bạn không giảm đi — nó đổi hướng. <strong>Thay vì phiêu lưu vì sự mới mẻ, bạn phiêu lưu vì sự hiểu biết ngày càng sâu hơn về vũ trụ rộng lớn mà bạn đang sống trong đó.</strong> Mỗi trải nghiệm mới không chỉ là một trải nghiệm — nó là một trang sách bổ sung vào cuốn bách khoa toàn thư sống của bạn.`,
            `Giai đoạn này cũng là thời điểm để thiết lập lại định nghĩa về "kết nối". Bạn không cần quá nhiều người — nhưng những người bạn chọn giữ lại cần thiết hơn bao giờ hết. <em>Chất lượng thay thế số lượng. Sự thực sự thay thế sự hào nhoáng.</em> Và bạn — với kinh nghiệm đời dồi dào — đã biết cách phân biệt hai thứ đó rất rõ ràng.`,
          ],
          lesson: `Giai đoạn thu hoạch với số 5 trao cho bạn điều mà nhiều người chỉ mơ ước: <strong>sự tự do thực sự — không phải vì không có gì ràng buộc, mà vì bạn đã học được cách sống trong bất kỳ hoàn cảnh nào mà vẫn cảm thấy mình đang bay</strong>.`
        },
        6: {
          theme: 'Viên mãn trong tình yêu — Thu hoạch những trái tim bạn đã gieo',
          paragraphs: [
            `Giai đoạn viên mãn của <strong>${safeName}</strong> với số <strong>6</strong> là hành trình về nhà — theo nghĩa sâu sắc nhất của từ này. Những gì bạn đã đặt vào gia đình, vào tình yêu, vào cộng đồng trong nhiều thập kỷ qua giờ hiện diện xung quanh bạn theo những hình thức ấm áp và cụ thể nhất. <em>Những con người bạn yêu thương và chăm sóc đang phản chiếu lại tình yêu đó.</em> Đây là thứ không có giá nào mua được.`,
            `Trong giai đoạn này, vai trò của bạn thường chuyển thành người <strong>truyền đạt sự khôn ngoan về tình yêu và gia đình</strong> cho những thế hệ sau. Không phải bằng những bài giảng hay lý thuyết — mà bằng cách sống đúng là tấm gương của những gì tình yêu thực sự trông như thế nào: sự hiện diện, sự kiên nhẫn, sự chấp nhận và sự tôn trọng lẫn nhau qua những thứ không dễ dàng.`,
            `Giai đoạn này cũng là thời điểm để học cách <em>buông bỏ những trách nhiệm mà bạn đã mang quá lâu</em>. Không phải từ bỏ — mà là trao lại cho những người đã sẵn sàng tiếp nhận. Khi bạn học cách giữ sợi dây kết nối trong khi không còn cần phải kéo căng nó nữa, bạn sẽ tìm thấy một loại bình an mà tất cả những năm tháng bận rộn không bao giờ cho phép.`,
          ],
          lesson: `Giai đoạn thu hoạch với số 6 cô đọng thành một sự thật ngắn gọn: <strong>tình yêu thương bạn đã cho đi — dù không ai đếm, dù không phải lúc nào cũng được đền đáp xứng đáng — đã tạo nên một di sản vô hình nhưng bất tử trong trái tim của tất cả những người may mắn được bạn yêu</strong>.`
        },
        7: {
          theme: 'Viên mãn trong tri thức — Chia sẻ những gì đã học được từ thâm sâu',
          paragraphs: [
            `Giai đoạn viên mãn của <strong>${safeName}</strong> với số <strong>7</strong> thường là thời kỳ mà sự khôn ngoan tích lũy cả đời bắt đầu tỏa sáng một cách tự nhiên và không cần cố gắng. <em>Bạn không cần phải chứng minh mình biết nhiều — điều đó hiện rõ trong cách bạn nghe, cách bạn đặt câu hỏi và cách bạn nói điều đúng vào đúng thời điểm mà không ai khác nhận ra là cần thiết.</em>`,
            `Giai đoạn này thường mang theo sự bình an nội tâm sâu sắc — không phải vì mọi thứ đã được giải đáp, mà vì bạn đã học được cách sống thoải mái với những câu hỏi không có câu trả lời. <strong>Đây là loại trí tuệ mà không trường đại học nào có thể trao — nó chỉ đến từ việc đã sống đủ lâu và đủ sâu để biết rằng sự bí ẩn không phải điều để sợ, mà là điều để tôn trọng.</strong>`,
            `Đóng góp của bạn trong giai đoạn này thường đến qua sự hiện diện và những cuộc trò chuyện. <em>Người tìm đến bạn không chỉ tìm câu trả lời — họ tìm sự hiểu biết.</em> Và bạn, với chiều sâu và sự bình an mà số 7 ở giai đoạn viên mãn mang lại, có thể trao cho họ thứ đó theo cách mà không có sách nào có thể thay thế.`,
          ],
          lesson: `Giai đoạn thu hoạch với số 7 tổng kết hành trình bằng một sự thật đẹp: <strong>sự khôn ngoan thực sự không phải là có câu trả lời cho mọi thứ — mà là biết những câu hỏi nào quan trọng nhất, và sống với chúng đủ lâu để hiểu được chiều sâu của chính những câu hỏi đó</strong>.`
        },
        8: {
          theme: 'Viên mãn trong di sản — Quyền lực được dùng để nâng đỡ',
          paragraphs: [
            `Giai đoạn viên mãn của <strong>${safeName}</strong> với số <strong>8</strong> là thời điểm mà những tài sản thực sự nhất của cuộc đời hiện ra — không phải chỉ là tài chính hay địa vị, mà là <em>sức ảnh hưởng có chiều sâu tích lũy qua nhiều thập kỷ của sự kiên định và chính trực.</em> Người ta tôn trọng bạn không vì những gì bạn có — mà vì những gì bạn đã làm và ai bạn đã là trong quá trình đó.`,
            `Giai đoạn này thường mang theo một sự chuyển hóa quan trọng với số 8: từ việc <em>tích lũy</em> sang việc <em>phân phối.</em> Đây là lúc bạn dùng những nguồn lực — tiền bạc, mạng lưới, kiến thức, ảnh hưởng — không phải để xây dựng thêm cho bản thân, mà để nâng đỡ những người đang ở vị trí bạn từng ở nhiều thập kỷ trước. <strong>Đây là khi vòng quay của số 8 khép lại hoàn toàn — và điều đó có một vẻ đẹp riêng không thể diễn tả.</strong>`,
            `Bình an nội tâm trong giai đoạn này đến từ việc nhận ra rằng thành công không phải là một đích đến — mà là một cuộc hành trình mà giá trị thật nằm trong những gì bạn học được và những ai bạn trở nên trong quá trình đó. <em>Sự nghiệp và tài sản có thể theo thời gian. Nhưng phẩm cách và di sản con người thì không.</em>`,
          ],
          lesson: `Giai đoạn thu hoạch với số 8 định nghĩa lại thành công theo cách đẹp nhất: <strong>quyền lực thực sự không phải là thứ bạn tích lũy được — mà là thứ bạn trao đi một cách khôn ngoan, và thấy nó tạo ra giá trị lớn hơn gấp nhiều lần trong tay những người bạn tin tưởng</strong>.`
        },
        9: {
          theme: 'Viên mãn trong buông bỏ — Sự giải phóng thiêng liêng',
          paragraphs: [
            `Giai đoạn viên mãn của <strong>${safeName}</strong> với số <strong>9</strong> là giai đoạn đẹp nhất và nhẹ nhàng nhất của hành trình dài — nếu bạn đã học được bài học tối quan trọng của số 9: <em>buông bỏ.</em> Điều này không có nghĩa là từ bỏ hay từ chối — đây là sự chấp nhận sâu sắc rằng mọi thứ đều có chu kỳ riêng, và sự khôn ngoan nằm ở chỗ biết khi nào là lúc ôm giữ và khi nào là lúc để đi.`,
            `Trong giai đoạn này, bạn thường trở thành <strong>người dẫn đường tâm linh</strong> cho những người xung quanh — không phải trong vai trò chính thức, mà đơn giản là qua sự hiện diện, qua những gì bạn đã sống qua và không còn sợ hãi. Người ta tìm đến bạn khi đứng trước những ngưỡng cửa lớn của cuộc đời vì họ cảm nhận rằng bạn đã đứng ở đó trước họ và đã đi qua với sự duyên dáng.`,
            `Tầm nhìn nhân đạo của bạn trong giai đoạn này đạt đến chiều sâu mà chỉ những năm tháng sống qua nhiều thứ mới tạo ra được. <em>Bạn không còn phân biệt "của tôi" và "của người khác" theo nghĩa cứng nhắc như trước.</em> Tình yêu của bạn mở rộng — không phải vì bạn cố gắng, mà vì sau tất cả những gì đã qua, bạn nhận ra rằng chúng ta tất cả đều đang ở trên cùng một con thuyền, với cùng những nỗi sợ và cùng những hy vọng.`,
          ],
          lesson: `Giai đoạn thu hoạch với số 9 để lại thông điệp thiêng liêng nhất của toàn bộ hành trình: <strong>cuộc đời không phải là về những gì bạn đạt được hay giữ lại được — mà là về những gì bạn đã cho đi, và sự nhẹ nhàng trong trái tim khi bạn nhận ra rằng sự cho đi đó đã tạo nên những gợn sóng tiếp tục lan rộng sau khi bạn không còn ở đây để thấy</strong>.`
        },
        11: {
          theme: 'Viên mãn của nhà tiên tri — Ánh sáng được trao lại',
          paragraphs: [
            `Giai đoạn viên mãn của <strong>${safeName}</strong> với số chủ <strong>11</strong> thường là giai đoạn mà sứ mệnh cuộc đời hiện ra rõ ràng nhất — không phải vì có ai đó tuyên bố, mà vì <em>bạn nhìn lại và thấy những sợi chỉ vô hình kết nối tất cả những gì bạn đã sống, đã học, đã trải qua.</em> Những điều từng có vẻ ngẫu nhiên giờ hiện ra như một bức tranh tổng thể có ý nghĩa sâu sắc.`,
            `Trong giai đoạn này, ảnh hưởng của bạn thường đến theo những cách bạn không hay biết. <strong>Những lời bạn nói, những điều bạn chia sẻ, những khoảnh khắc hiện diện chân thực mà bạn trao cho người khác — chúng sống tiếp trong những trái tim đó và lan truyền ra những nơi bạn không bao giờ thể đến được.</strong> Đây là sức mạnh thực sự của số 11 — không phải sân khấu lớn, mà là những kết nối âm thầm nhưng bất tử.`,
            `Sự bình an nội tâm của giai đoạn này đến từ việc không còn phải mang một mình gánh nặng của nhận thức. <em>Bạn đã học cách chia sẻ ánh sáng mà không bị tiêu tán, học cách bảo vệ sự nhạy cảm của mình mà không cần xây tường cao, học cách tồn tại với trọn vẹn cả hai thế giới — vật chất và tâm linh — mà không phải chọn một.</em>`,
          ],
          lesson: `Giai đoạn thu hoạch với số 11 tổng kết sứ mệnh bằng sự thật đơn giản nhưng sâu sắc nhất: <strong>bạn không đến thế giới này để được nhớ đến — bạn đến để thắp sáng. Và ánh sáng một khi đã được thắp lên thì không cần ai nhớ nguồn gốc — nó cứ tiếp tục soi sáng những con đường mà chính bạn cũng không thề thấy hết</strong>.`
        },
        22: {
          theme: 'Viên mãn của người kiến tạo — Di sản vĩ đại đứng vững',
          paragraphs: [
            `Giai đoạn viên mãn của <strong>${safeName}</strong> với số chủ <strong>22</strong> là lúc bạn có thể đứng lại và nhìn thấy những gì đã được xây dựng — không chỉ bằng tay bạn mà bằng tầm nhìn, sự kiên trì và sức chịu đựng của bạn qua nhiều thập kỷ. <em>Có những điều bạn đã tạo ra sẽ tồn tại lâu hơn bạn</em> — tổ chức, hệ thống, ý tưởng, con người bạn đã ảnh hưởng — và nhận ra điều đó có một ý nghĩa thiêng liêng khó diễn tả.`,
            `Giai đoạn này thường mang theo sự chuyển giao quan trọng: từ việc là người xây dựng sang trở thành <strong>người truyền cảm hứng cho thế hệ tiếp theo tiếp tục xây</strong>. Tầm nhìn bạn đã mang theo cả đời bây giờ cần được đặt vào những bàn tay khác — những người đủ trẻ để thực thi và đủ tầm để hiểu. Đây không phải sự từ bỏ — đây là hình thức đóng góp cao nhất.`,
            `Trong giai đoạn này, bình an đến từ việc nhận ra rằng <em>vĩ đại không đo bằng phạm vi mà đo bằng chiều sâu.</em> Bạn không cần phải thay đổi cả thế giới — bạn chỉ cần thay đổi đủ sâu trong phần thế giới mà bạn chạm đến. Và khi nhìn lại, bạn sẽ thấy rằng điều đó đã lan ra rộng hơn rất nhiều so với những gì bạn từng dám hy vọng.`,
          ],
          lesson: `Giai đoạn thu hoạch với số 22 kết thúc bằng sự thật vĩ đại nhất: <strong>di sản thực sự không phải là những thứ bạn xây bằng vật liệu — mà là những thứ bạn xây bằng cam kết, bằng tầm nhìn và bằng lòng dũng cảm để tin vào điều gì đó lớn hơn chính mình ngay cả khi không ai khác còn thấy nó rõ như bạn</strong>.`
        },
      },
    };

    // ── ADVICE DATA: lời khuyên thực tiễn cho (cycle × num) ──
    const adviceData: Record<number, Record<number, LifeCycleAdvice>> = {
      1: { // CHU KỲ 1 — Niên Thiếu (Hình Thành)
        1: {
          career: `Tập trung học và thực hành kỹ năng lãnh đạo sớm — tham gia các câu lạc bộ, nhóm dự án, cuộc thi để rèn tính tiên phong. Chọn ngành học phù hợp với khát vọng dẫn đầu (kinh doanh, kỹ thuật, khoa học). <strong>Tránh</strong> để người khác áp đặt con đường nghề nghiệp của bạn.`,
          finance: `Bắt đầu tiết kiệm từ sớm dù số tiền nhỏ — xây dựng thói quen tài chính kỷ luật. Không vay mượn bốc đồng. Học kiến thức tài chính cơ bản như một môn học ưu tiên.`,
          health: `Kênh năng lượng dồi dào vào thể thao và hoạt động thể chất có cấu trúc. Học cách ngủ đủ giấc và quản lý stress sớm — tránh kiệt sức do làm việc quá mức.`,
          relationship: `Học cách lắng nghe thay vì luôn muốn dẫn đầu trong giao tiếp. Xây dựng tình bạn dựa trên sự tôn trọng lẫn nhau, không phải thống trị.`,
          avoid: `Bảo thủ, không chịu nhận góp ý; cô lập bản thân để tránh xung đột; chi tiêu bốc đồng để chứng tỏ `
        },
        2: {
          career: `Phát triển kỹ năng giao tiếp, lắng nghe và làm việc nhóm — đây là nền tảng nghề nghiệp lâu dài của bạn. Chọn hướng học liên quan đến con người (tâm lý, giáo dục, y tế, ngoại giao). <strong>Tránh</strong> để người khác lấn át quyết định học tập của bạn.`,
          finance: `Xây dựng ngân sách cơ bản và tránh chi tiêu cảm tính. Học cách đàm phán và thương lượng — kỹ năng này sẽ sinh lời cả đời. Tránh cho mượn tiền vì nể nang.`,
          health: `Chú ý sức khỏe tinh thần — học cách đặt ranh giới cảm xúc lành mạnh. Tập thể dục nhẹ nhàng như yoga, bơi lội. Không nhịn ăn hay bỏ bữa vì bận lo cho người khác.`,
          relationship: `Học cách nói "không" mà không cảm thấy có lỗi. Chọn bạn bè có chiều sâu thay vì chạy theo số lượng. Tránh quan hệ bạn bè phụ thuộc một chiều.`,
          avoid: `Hy sinh bản thân quá mức; để người khác kiểm soát quyết định của mình; tránh xung đột lành mạnh cần thiết`
        },
        3: {
          career: `Nuôi dưỡng tài năng nghệ thuật và sáng tạo — đừng để áp lực "thực tế" dập tắt thiên phú của bạn. Tìm hướng kết hợp sáng tạo với ứng dụng (thiết kế, truyền thông, marketing). <strong>Tránh</strong> bỏ dở quá nhiều dự án học tập.`,
          finance: `Thiết lập ngân sách cho các hoạt động sáng tạo. Học cách biến tài năng thành thu nhập sớm — bắt đầu từ những freelance nhỏ. Tránh chi tiêu bốc hứng.`,
          health: `Dành thời gian vui chơi có chủ đích — niềm vui là nhiên liệu của bạn. Tránh stress vì cố gắng làm hài lòng người khác. Ngủ đủ giấc thay vì thức khuya sáng tác.`,
          relationship: `Học cách lắng nghe sâu hơn là chỉ nói. Xây dựng tình bạn vượt qua lớp vui vẻ bề ngoài. Thực hành cam kết nhỏ để rèn tính kiên nhẫn.`,
          avoid: `Bỏ dở các cam kết khi mất hứng; che giấu cảm xúc sâu sau lớp vui vẻ; tiêu xài không có kế hoạch`
        },
        4: {
          career: `Đầu tư nghiêm túc vào nền móng học vấn — đây là giai đoạn quan trọng nhất để xây kỹ năng cốt lõi. Chọn ngành có tính thực tế và ứng dụng cao. Rèn thói quen học tập có hệ thống từ sớm.`,
          finance: `Lập "hũ tiết kiệm" từ số tiền nhỏ và duy trì không gián đoạn. Học về ngân sách cá nhân và tránh nợ nần trong giai đoạn đầu đời. Tiết kiệm trước khi chi tiêu.`,
          health: `Xây dựng thói quen vận động đều đặn — không cần cường độ cao, chỉ cần kiên trì. Giữ giờ ngủ ổn định. Tránh làm việc quá sức đến kiệt sức.`,
          relationship: `Đầu tư vào ít mối quan hệ nhưng sâu sắc. Học cách thư giãn và vui chơi — không phải lúc nào cũng cần nghiêm túc. Mở cửa cho sự tự phát và kết nối thật sự.`,
          avoid: `Cứng nhắc đến mức không thể thích nghi; bỏ qua sức khỏe vì học hành; cô lập bản thân trong "bong bóng kỷ luật"`
        },
        5: {
          career: `Thử nhiều hướng học tập và hoạt động ngoại khóa để tìm ra đam mê thực sự. Tránh chọn ngành chỉ vì ổn định — bạn cần sự kích thích trí tuệ. Phát triển nhiều kỹ năng linh hoạt thay vì chuyên sâu quá sớm.`,
          finance: `Học cách quản lý chi tiêu trong môi trường luôn thay đổi. Xây dựng quỹ khẩn cấp nhỏ để đối phó bất ngờ. Tránh đặt cược tài chính lớn vào "cơ hội hấp dẫn" chưa kiểm chứng.`,
          health: `Kênh tốc độ và năng lượng vào thể thao phiêu lưu (leo núi, bơi, võ thuật). Học cách dừng lại và nghỉ ngơi — không phải lúc nào cũng cần di chuyển. Tránh lạm dụng kích thích.`,
          relationship: `Học cách duy trì kết nối khi hoàn cảnh thay đổi. Đừng bỏ rơi người quan trọng khi đang bận chạy theo điều mới. Thực hành cam kết nhỏ để xây nền tảng lòng tin.`,
          avoid: `Bỏ dở mọi thứ khi mất hứng; chi tiêu theo cảm hứng không có kế hoạch; tránh mọi trách nhiệm dưới danh nghĩa "tự do"`
        },
        6: {
          career: `Hướng đến ngành nghề liên quan đến chăm sóc và phục vụ (y tế, giáo dục, tư vấn, thiết kế không gian sống). Học cách đặt ranh giới lành mạnh trong công việc nhóm. <strong>Tránh</strong> hy sinh việc học vì quá bận lo người khác.`,
          finance: `Tránh cho mượn tiền vì lòng tốt quá mức — học nói không với tài chính. Xây dựng ngân sách ưu tiên bản thân trước. Thiết lập mục tiêu tài chính rõ ràng cho tương lai.`,
          health: `Ưu tiên sức khỏe của chính mình trước — bạn không thể cho từ chiếc bình rỗng. Học cách nhận sự chăm sóc từ người khác thay vì luôn là người cho đi.`,
          relationship: `Đặt ranh giới rõ ràng trong các mối quan hệ — yêu thương không có nghĩa là không có giới hạn. Chọn bạn bè biết trân trọng và đáp lại sự quan tâm của bạn.`,
          avoid: `Hy sinh nhu cầu bản thân hoàn toàn vì người khác; can thiệp quá mức vào cuộc sống của người thân; bỏ bê sức khỏe cá nhân`
        },
        7: {
          career: `Phát triển chiều sâu trong một lĩnh vực trí tuệ thay vì rải rác. Chọn ngành cần tư duy phân tích sâu (khoa học, nghiên cứu, triết học, công nghệ). Đừng để áp lực xã hội buộc bạn chọn con đường "ổn định" mà thiếu chiều sâu.`,
          finance: `Nghiên cứu kỹ trước khi đầu tư bất cứ điều gì — đây là điểm mạnh tự nhiên của bạn. Xây dựng nền tảng tài chính ổn định trước khi mạo hiểm. Tránh bị thuyết phục bởi cơ hội nghe hay nhưng chưa được kiểm chứng.`,
          health: `Tạo thói quen thiền định hoặc tĩnh lặng hàng ngày — não bạn cần thời gian yên tĩnh để phục hồi. Tránh cô lập xã hội quá mức. Duy trì kết nối với thiên nhiên thường xuyên.`,
          relationship: `Học cách mở lòng chia sẻ nội tâm thay vì chỉ quan sát. Xây dựng tối thiểu 1-2 tình bạn thực sự sâu sắc. Thực hành kết nối cảm xúc — không chỉ kết nối trí tuệ.`,
          avoid: `Cô lập hoàn toàn; phân tích quá nhiều đến mức không hành động; coi thường cảm xúc của người khác`
        },
        8: {
          career: `Phát triển tư duy kinh doanh và chiến lược từ sớm. Tìm kiếm mentor trong lĩnh vực bạn muốn thống lĩnh. Học về lãnh đạo và quản lý tổ chức — đây là nền tảng cho tương lai bạn hướng đến.`,
          finance: `Học quản lý tài chính nghiêm túc như một kỹ năng chuyên nghiệp. Bắt đầu xây dựng thói quen tiết kiệm và đầu tư nhỏ. Tránh phô trương tài chính để khẳng định địa vị.`,
          health: `Học cách biết điểm dừng — tham vọng lớn dễ dẫn đến kiệt sức. Xây dựng thói quen tập luyện có kỷ luật. Quản lý stress bằng hoạt động thể chất, không phải công việc thêm.`,
          relationship: `Học cách kết nối với con người không chỉ qua lợi ích. Thực hành lắng nghe và thấu cảm — đây là điểm yếu cần rèn luyện. Tránh coi mọi mối quan hệ là "đầu tư chiến lược".`,
          avoid: `Ám ảnh thành công đến mức bỏ qua mọi thứ khác; sử dụng người khác để đạt mục đích; kiêu ngạo khi thành công nhỏ`
        },
        9: {
          career: `Khám phá các ngành nghề có ý nghĩa nhân văn rộng lớn — nghệ thuật, giáo dục, xã hội, y tế. Không bị áp lực chọn nghề chỉ vì thu nhập cao. Tìm công việc chạm đến trái tim bạn.`,
          finance: `Học cách cân bằng giữa lòng hào phóng và sự thực tế tài chính. Thiết lập ngân sách từ thiện có kế hoạch, không chi bốc đồng. Xây dựng nền tảng tài chính vững trước khi phụng sự người khác.`,
          health: `Học cách đặt ranh giới cảm xúc — không ôm hết nỗi đau của thế giới. Thực hành buông bỏ hàng ngày. Tìm hoạt động tái tạo năng lượng riêng cho mình.`,
          relationship: `Học cách nhận bằng cách cho đi — yêu thương phải là hai chiều. Chọn người bạn đời và bạn bè có giá trị nhân văn tương đồng. Tránh cứu vớt những người không muốn được cứu.`,
          avoid: `Lý tưởng hóa đến mức không thực tế; kiệt sức vì quá quan tâm đến người khác; bỏ qua nhu cầu vật chất thiết thực của bản thân`
        },
        11: {
          career: `Phát triển kỹ năng biểu đạt trực giác qua nghệ thuật, âm nhạc, hoặc ngôn ngữ. Chọn môi trường học tập kích thích sự sáng tạo và chiều sâu. Học cách "neo" tầm nhìn vào hành động thực tế cụ thể.`,
          finance: `Xây dựng nền tảng tài chính ổn định để tầm nhìn cao cả của bạn có chỗ đứng vững. Tránh bị cuốn vào các ý tưởng hào nhoáng không có căn cơ. Học cách định giá đúng cho giá trị bạn tạo ra.`,
          health: `Quản lý hệ thần kinh nhạy cảm — thiền định, âm nhạc, thiên nhiên là liều thuốc tốt nhất. Học cách thoát khỏi sự quá kích thích. Ngủ đủ giấc là ưu tiên không thương lượng.`,
          relationship: `Tìm người hiểu được chiều sâu và trực giác của bạn. Học cách kết nối ở cả hai cấp độ — tinh thần và đời thường. Tránh cô lập khi cảm thấy "không ai hiểu mình".`,
          avoid: `Sống hoàn toàn trong thế giới ý tưởng mà quên hành động; lo lắng và nặng gánh quá mức; bác bỏ nhu cầu thực tế với lý do "tâm linh"`
        },
        22: {
          career: `Bắt đầu xây dựng tư duy hệ thống và quy mô lớn — đọc về lịch sử, văn minh, lãnh đạo. Tìm mentor với tầm nhìn dài hạn. Chọn nền tảng học thuật vững chắc cho tương lai xây dựng lớn.`,
          finance: `Xây dựng kỷ luật tài chính nghiêm ngặt — tầm nhìn lớn cần nền tảng vật chất vững. Tránh phung phí những gì chưa có. Học về đầu tư dài hạn và xây dựng tài sản có mục đích.`,
          health: `Học cách cân bằng giữa tham vọng lớn và sức khỏe thể chất. Xây dựng thói quen tập luyện ổn định. Tránh kiệt sức sớm vì áp lực tự đặt ra.`,
          relationship: `Tìm người bạn đường chia sẻ tầm nhìn lớn. Học cách trân trọng những khoảnh khắc nhỏ bé trong cuộc sống bình thường. Tránh coi mọi người như "nguồn lực cho sứ mệnh".`,
          avoid: `Bỏ qua nhu cầu cơ bản vì mải mê tầm nhìn; tự cô lập với lý do "người thường không hiểu"; kiệt sức trước khi dự án lớn bắt đầu`
        }
      },
      2: { // CHU KỲ 2 — Trưởng Thành (Xây Dựng)
        1: {
          career: `Đây là thời điểm khẳng định vị trí lãnh đạo và xây dựng sự nghiệp độc lập. Dũng cảm khởi nghiệp hoặc đảm nhận vai trò lớn hơn. Tránh ở quá lâu trong vai trò không cho phép bạn phát huy toàn lực.`,
          finance: `Đầu tư vào bản thân — kỹ năng, mạng lưới, kinh nghiệm — đây là tài sản sinh lời cao nhất. Xây dựng thu nhập đa nguồn. Tránh đặt tất cả trứng vào một giỏ.`,
          health: `Duy trì thói quen tập luyện như một kỷ luật lãnh đạo, không phải tùy hứng. Học cách ủy quyền để tránh kiệt sức. Nghỉ ngơi có chiến lược là một năng lực, không phải điểm yếu.`,
          relationship: `Xây dựng mối quan hệ đối tác bình đẳng — cả trong công việc lẫn cuộc sống. Học cách ăn mừng thành công của người khác. Tránh để tham vọng cá nhân làm xói mòn các mối quan hệ quan trọng.`,
          avoid: `Kiêu ngạo và cứng đầu khi thành công; cô lập vì nghĩ "không ai hiểu tầm nhìn của mình"; bỏ bê sức khỏe và các mối quan hệ`
        },
        2: {
          career: `Xây dựng danh tiếng qua các mối quan hệ nghề nghiệp sâu sắc và lâu dài. Tìm kiếm cơ hội hợp tác chiến lược. Tránh chấp nhận vai trò không được tôn trọng chỉ vì ngại xung đột.`,
          finance: `Hợp tác tài chính cần hợp đồng rõ ràng — lòng tốt không thay thế sự minh bạch. Xây dựng quỹ dự phòng cá nhân. Tránh bảo lãnh tài chính cho người khác.`,
          health: `Học cách tự chăm sóc sức khỏe với cùng sự ân cần bạn dành cho người khác. Quản lý căng thẳng bằng cách đặt ra ranh giới rõ ràng. Tránh kiệt sức vì quá nhiều cam kết xã hội.`,
          relationship: `Giai đoạn này phù hợp để xây dựng mối quan hệ lâu dài — trong công việc và tình cảm. Học cách nêu nhu cầu của mình một cách thẳng thắn. Tránh mối quan hệ phụ thuộc một chiều.`,
          avoid: `Đồng ý với tất cả để tránh xung đột; bị lợi dụng vì quá tốt bụng; bỏ qua nhu cầu cá nhân vì mải phục vụ người khác`
        },
        3: {
          career: `Giai đoạn tỏa sáng trong lĩnh vực sáng tạo và biểu đạt. Nắm bắt cơ hội trình bày, phát biểu, xuất bản. Đây là thời điểm xây dựng thương hiệu cá nhân mạnh mẽ.`,
          finance: `Đa dạng hóa nguồn thu từ kỹ năng sáng tạo. Xây dựng mạng lưới khách hàng và đối tác. Tránh chi tiêu theo cảm hứng mà không có kế hoạch dài hạn.`,
          health: `Duy trì năng lượng sáng tạo bằng lịch trình có cấu trúc. Tránh kiệt sức vì quá nhiều dự án song song. Học cách hoàn thành trước khi bắt đầu điều mới.`,
          relationship: `Xây dựng cộng đồng sáng tạo xung quanh mình. Chọn người bạn đời trân trọng sự sáng tạo và không kiểm soát nó. Học cách lắng nghe sâu trong mối quan hệ.`,
          avoid: `Bỏ dở quá nhiều dự án khi mất hứng; chi tiêu theo cảm hứng sáng tạo không có ngân sách; bỏ qua sức khỏe vì mải mê sáng tác`
        },
        4: {
          career: `Giai đoạn xây dựng sự nghiệp bền vững — đừng nản lòng với tiến độ chậm. Mỗi bước nhỏ đều quan trọng. Tìm kiếm vị trí có ổn định và cho phép bạn xây dựng chuyên môn sâu.`,
          finance: `Xây dựng nền tảng tài chính vững chắc — mua bảo hiểm, tăng tiết kiệm, đầu tư an toàn dài hạn. Tránh các quyết định tài chính bốc đồng hoặc rủi ro cao.`,
          health: `Xây dựng thói quen sức khỏe kiên nhẫn và bền vững — không phải sprint, mà là marathon. Duy trì lịch khám sức khỏe định kỳ. Tránh làm việc đến kiệt sức.`,
          relationship: `Đầu tư thời gian chất lượng vào gia đình và người thân. Học cách biểu đạt tình cảm bằng lời nói, không chỉ hành động. Xây dựng mối quan hệ đối tác thực sự bình đẳng.`,
          avoid: `Cứng nhắc đến mức không thích nghi với thay đổi cần thiết; làm việc quá sức đến mức hy sinh sức khỏe; trì hoãn niềm vui vì "chưa đủ ổn định"`
        },
        5: {
          career: `Mở lòng với những cơ hội không theo kế hoạch — thay đổi này có thể là bước ngoặt. Phát triển đa kỹ năng và mạng lưới rộng. Tránh bám víu vào vị trí không còn phù hợp vì sợ thay đổi.`,
          finance: `Xây dựng quỹ dự phòng lớn hơn để thoải mái với sự biến động. Tránh đặt cược lớn vào cơ hội chưa được kiểm chứng. Học cách quản lý dòng tiền không đều.`,
          health: `Duy trì thói quen sức khỏe cơ bản ngay cả khi mọi thứ thay đổi. Học cách phục hồi nhanh sau biến động. Tránh lạm dụng kích thích để đối phó với stress.`,
          relationship: `Giao tiếp rõ ràng về nhu cầu tự do của bạn với người thân. Học cách duy trì kết nối trong khi vẫn phát triển cá nhân. Tránh bỏ rơi người quan trọng khi đang bận chạy theo đổi mới.`,
          avoid: `Thay đổi hướng đi quá thường xuyên đến mức không xây được gì; chi tiêu liều lĩnh trong giai đoạn thu nhập không ổn định; né tránh cam kết cần thiết`
        },
        6: {
          career: `Giai đoạn lý tưởng để phát triển sự nghiệp liên quan đến chăm sóc và phục vụ. Xây dựng uy tín qua sự đáng tin cậy và tận tâm. Tránh đặt công việc lên trên sức khỏe gia đình.`,
          finance: `Lập kế hoạch tài chính gia đình dài hạn — bảo hiểm, giáo dục con cái, nhà cửa. Tránh chi tiêu quá mức cho gia đình đến mức bỏ bê dự phòng cá nhân. Cân bằng giữa cho đi và tích lũy.`,
          health: `Nhớ chăm sóc sức khỏe bản thân trong khi chăm sóc gia đình. Tránh hy sinh giấc ngủ và dinh dưỡng vì bận lo cho người khác. Đặt lịch tái tạo năng lượng cá nhân.`,
          relationship: `Đây là giai đoạn vàng để đầu tư vào gia đình và mối quan hệ thân thiết. Học cách yêu thương có ranh giới lành mạnh. Tránh kiểm soát người thân dù xuất phát từ lòng tốt.`,
          avoid: `Hy sinh bản thân hoàn toàn cho gia đình; kiểm soát người thân dưới danh nghĩa quan tâm; bỏ bê sự phát triển cá nhân`
        },
        7: {
          career: `Đầu tư vào việc trở thành chuyên gia thực sự trong lĩnh vực của mình. Nghiên cứu, học hỏi sâu hơn là mở rộng nhanh. Xây dựng uy tín qua sự hiểu biết sâu sắc thay vì chứng chỉ bề ngoài.`,
          finance: `Nghiên cứu kỹ trước mọi quyết định đầu tư lớn. Không để người khác "thuyết phục" bạn vào cơ hội chưa được kiểm chứng. Xây dựng nền tảng tài chính ổn định để có không gian suy nghĩ.`,
          health: `Thiền định và tĩnh lặng là ưu tiên sức khỏe quan trọng nhất của bạn. Giữ cân bằng giữa thời gian một mình và thời gian kết nối xã hội. Tránh cô lập quá mức.`,
          relationship: `Học cách chia sẻ thế giới nội tâm phong phú với những người bạn tin tưởng. Tìm bạn đời và bạn bè có chiều sâu trí tuệ tương đồng. Đừng để sự độc lập trở thành xa cách.`,
          avoid: `Phân tích quá mức đến tê liệt quyết định; cô lập xã hội quá mức; bỏ qua cảm xúc và kết nối con người vì quá chú trọng trí tuệ`
        },
        8: {
          career: `Giai đoạn thu hoạch và mở rộng mạnh mẽ nhất. Dũng cảm đàm phán, mở rộng, đầu tư. Xây dựng hệ thống tạo thu nhập thụ động. Tránh chần chừ trước cơ hội xứng đáng.`,
          finance: `Đây là giai đoạn tốt nhất để mua bất động sản, đầu tư dài hạn, mở rộng kinh doanh. Học cách dùng đòn bẩy tài chính thông minh. Tránh tích lũy mà không có mục tiêu rõ ràng.`,
          health: `Quản lý căng thẳng quyết định qua hoạt động thể chất có cường độ đủ lớn. Không hy sinh sức khỏe vì tham vọng ngắn hạn. Đặt giới hạn làm việc rõ ràng.`,
          relationship: `Dành thời gian chất lượng cho người thân ngay cả trong giai đoạn bận rộn đỉnh điểm. Học cách thể hiện tình yêu bằng hiện diện, không chỉ bằng vật chất. Chọn đối tác cùng tầm nhìn.`,
          avoid: `Ưu tiên kết quả hơn con người; kiệt sức vì không biết dừng lại; tích lũy không có mục đích ngoài số lượng`
        },
        9: {
          career: `Tìm tới những công việc có ý nghĩa nhân văn sâu sắc, nơi bạn đóng góp thực sự. Tránh làm việc chỉ vì thu nhập mà thiếu ý nghĩa — điều này làm kiệt năng lượng của bạn. Giai đoạn tốt để đóng góp cho cộng đồng.`,
          finance: `Xây dựng nền tảng tài chính vững trước khi cho đi — hào phóng cần đi kèm với sự bền vững. Lập ngân sách từ thiện có kế hoạch. Học cách buông bỏ những khoản đầu tư không còn hiệu quả.`,
          health: `Học cách đặt ranh giới cảm xúc — không ôm hết nỗi đau của thế giới. Tìm hoạt động chữa lành và tái tạo năng lượng cho chính mình. Thực hành buông bỏ hàng ngày.`,
          relationship: `Đây là giai đoạn học cách yêu thương vô điều kiện — cả với bản thân lẫn người khác. Học cách tha thứ để giải phóng bản thân. Tránh mối quan hệ tiêu hao một chiều.`,
          avoid: `Kiệt sức vì quá nhiều từ bi không có ranh giới; ôm đồm sứ mệnh cứu vớt thế giới; bỏ qua nhu cầu tài chính thiết thực`
        },
        11: {
          career: `Theo đuổi con đường sáng tạo, tư vấn tâm linh, hoặc truyền cảm hứng nơi trực giác của bạn là tài sản. Học cách hiện thực hóa tầm nhìn bằng các bước cụ thể. Tìm người cộng sự thực tế bổ trợ cho tầm nhìn của bạn.`,
          finance: `Định giá đúng cho giá trị đặc biệt bạn mang lại — không tự hạ giá. Xây dựng nền tảng tài chính ổn định để tầm nhìn cao cả có đất đứng. Tránh chi tiêu theo cảm hứng tâm linh.`,
          health: `Quản lý sự nhạy cảm của hệ thần kinh bằng thực hành chánh niệm thường xuyên. Tránh tiếp nhận quá nhiều năng lượng tiêu cực. Ngủ đủ giấc và phục hồi năng lượng là thiết yếu.`,
          relationship: `Tìm người bạn đời có đủ chiều sâu để tham gia và hiểu hành trình nội tâm của bạn. Học cách kết nối ở cấp độ đời thường bên cạnh cấp độ tâm linh. Không bỏ rơi bản thân vì sứ mệnh.`,
          avoid: `Sống hoàn toàn trong cõi ý tưởng mà không hành động; bị kiệt sức bởi sự nhạy cảm quá mức; hạ thấp giá trị bản thân`
        },
        22: {
          career: `Giai đoạn triển khai tầm nhìn lớn — xây dựng tổ chức, hệ thống, phong trào có quy mô thực sự. Tập hợp đội ngũ xứng tầm. Tránh cố làm một mình những gì cần nhiều người.`,
          finance: `Xây dựng mô hình tài chính bền vững cho tầm nhìn lớn. Học cách huy động vốn và quản lý nguồn lực quy mô lớn. Tránh hi sinh tài chính cá nhân cho sứ mệnh đến mức không bền vững.`,
          health: `Sức khỏe là nhiên liệu của sứ mệnh lớn — không thể bỏ qua. Xây dựng hệ thống hỗ trợ để không phải gánh chịu tất cả một mình. Học cách ủy quyền và tin tưởng đội ngũ.`,
          relationship: `Tìm người bạn đời và cộng sự hiểu và chia sẻ tầm nhìn của bạn. Học cách trân trọng những khoảnh khắc bình thường trong cuộc sống. Không hi sinh hoàn toàn đời sống cá nhân cho sứ mệnh.`,
          avoid: `Mất kết nối với con người bình thường vì sứ mệnh quá lớn; kiệt sức trước khi hoàn thành; bỏ qua sức khỏe cá nhân và các mối quan hệ thân thiết`
        }
      },
      3: { // CHU KỲ 3 — Viên Mãn (Thu Hoạch)
        1: {
          career: `Tiếp tục đóng góp và dẫn dắt theo hình thức phù hợp với giai đoạn này — cố vấn, mentor, hoặc khởi đầu điều gì đó hoàn toàn mới. Chia sẻ kinh nghiệm lãnh đạo cho thế hệ sau. Không cần nghỉ hưu hoàn toàn.`,
          finance: `Chuyển hướng từ tích lũy sang phân phối khôn ngoan — gia đình, từ thiện, đầu tư cho thế hệ sau. Đơn giản hóa tài chính để giảm gánh nặng quản lý. Đảm bảo dự phòng cho tuổi già.`,
          health: `Điều chỉnh cường độ hoạt động thể chất phù hợp tuổi tác nhưng không dừng lại hoàn toàn. Ưu tiên chất lượng giấc ngủ và dinh dưỡng. Học cách nghỉ ngơi mà không cảm thấy tội lỗi.`,
          relationship: `Đầu tư vào gia đình và di sản con người quan trọng hơn bao giờ hết. Học cách nhận sự chăm sóc từ người thân. Nuôi dưỡng các mối quan hệ sâu sắc thay vì mở rộng mạng lưới.`,
          avoid: `Không thể nghỉ ngơi và ủy quyền; kiệt sức vì vẫn muốn một mình gánh hết; xa cách con người vì không ai "đủ tầm"`
        },
        2: {
          career: `Giai đoạn thu hoạch mối quan hệ và tình cảm — những kết nối bạn đã xây dựng cả đời nở hoa. Đóng góp qua vai trò hòa giải, cố vấn và kết nối. Chia sẻ sự khôn ngoan về tình người.`,
          finance: `Đơn giản hóa tài chính và giảm rủi ro. Chuẩn bị kế hoạch di sản cẩn thận. Tránh bị lợi dụng tài chính vì lòng tốt quá mức ở giai đoạn này.`,
          health: `Duy trì các hoạt động xã hội tích cực — cô đơn là nguy cơ sức khỏe lớn nhất. Thực hành thiền định và tĩnh lặng. Ưu tiên chất lượng mối quan hệ thay vì sự kiện.`,
          relationship: `Giai đoạn thu hoạch tình người — tận hưởng chiều sâu của các mối quan hệ đã được xây dựng cả đời. Học cách nhận tình yêu thay vì luôn là người cho đi. Tha thứ và chữa lành những vết thương cũ.`,
          avoid: `Cô lập xã hội; bị lợi dụng tài chính vì lòng tốt; mang theo oán giận cũ không giải quyết`
        },
        3: {
          career: `Tiếp tục sáng tạo và biểu đạt — tinh thần số 3 không có khái niệm "về hưu". Viết hồi ký, dạy nghề, hoặc theo đuổi dự án nghệ thuật mơ ước. Chia sẻ tài năng với cộng đồng.`,
          finance: `Đơn giản hóa tài chính để có thêm thời gian và năng lượng cho sáng tạo. Chuẩn bị di sản sáng tạo — tác phẩm, dạy nghề. Tránh chi tiêu bốc đồng ở giai đoạn này.`,
          health: `Duy trì các hoạt động tạo niềm vui — đây là thuốc bổ tốt nhất. Tham gia câu lạc bộ sáng tạo và cộng đồng xã hội. Học cách quản lý năng lượng khôn ngoan hơn.`,
          relationship: `Chia sẻ niềm vui sống với người thân và cộng đồng. Trở thành nguồn ánh sáng và cảm hứng cho thế hệ sau. Nuôi dưỡng tình bạn cũ và mở đón tình bạn mới.`,
          avoid: `Thu mình lại trong khi vẫn còn nhiều để cho đi; để nỗi cô đơn dập tắt ngọn lửa sáng tạo; sống trong quá khứ`
        },
        4: {
          career: `Giai đoạn thu hoạch những gì đã xây dựng cả đời. Đóng góp kinh nghiệm thực tiễn cho tổ chức và gia đình. Trở thành người giữ gìn di sản và truyền thống có giá trị.`,
          finance: `Đơn giản hóa và củng cố tài chính. Chuẩn bị kế hoạch di sản rõ ràng. Tránh phức tạp hóa tài chính ở giai đoạn này — sự giản dị là sức mạnh.`,
          health: `Duy trì thói quen thể chất ổn định và vừa sức. Quan tâm đến sức khỏe tâm thần và kết nối xã hội. Học cách linh hoạt hơn khi cơ thể đặt ra giới hạn mới.`,
          relationship: `Trở thành nền tảng ổn định cho gia đình và cộng đồng. Chia sẻ sự khôn ngoan thực tế của cả đời. Học cách buông bỏ kiểm soát và tin tưởng thế hệ sau.`,
          avoid: `Cứng nhắc khi thế giới thay đổi xung quanh; không thể buông bỏ kiểm soát và ủy quyền; cô lập vì "người trẻ không hiểu"`
        },
        5: {
          career: `Giai đoạn tự do thực sự — khám phá những điều từng bị trì hoãn. Đừng tự giới hạn bởi tuổi tác. Chia sẻ hành trình phong phú với người xung quanh qua viết lách hoặc nói chuyện.`,
          finance: `Cân bằng giữa hưởng thụ và bảo tồn tài sản. Chuẩn bị dự phòng đủ cho tuổi cao. Tránh các đầu tư rủi ro cao ở giai đoạn này — bảo toàn quan trọng hơn sinh lợi.`,
          health: `Duy trì hoạt động thể chất phù hợp với tình trạng sức khỏe thực tế. Tránh phiêu lưu vượt quá giới hạn an toàn. Học cách thích nghi với những thay đổi thể chất tự nhiên.`,
          relationship: `Duy trì sự tò mò và cởi mở với người mới. Chia sẻ kinh nghiệm sống phong phú với thế hệ trẻ. Học cách nhận sự hỗ trợ từ người thân khi cần.`,
          avoid: `Liều lĩnh về thể chất hoặc tài chính vì muốn "sống trọn vẹn"; từ chối nhận sự giúp đỡ; phiêu lưu vượt quá giới hạn an toàn`
        },
        6: {
          career: `Giai đoạn thu hoạch tình yêu thương và di sản gia đình. Vai trò ông bà, người cố vấn gia đình là thiêng liêng nhất. Đóng góp cho cộng đồng qua tình nguyện và chăm sóc.`,
          finance: `Chuẩn bị di sản tài chính cho gia đình một cách công bằng và rõ ràng. Đơn giản hóa tài chính cá nhân. Tránh để gánh nặng tài chính đổ lên con cháu không cần thiết.`,
          health: `Học cách nhận sự chăm sóc từ gia đình — đây là kết quả tự nhiên của những gì bạn đã gieo. Tránh kiệt sức vì vẫn muốn "lo hết". Duy trì các hoạt động xã hội tích cực.`,
          relationship: `Giai đoạn viên mãn nhất của mọi mối quan hệ. Tận hưởng và trân trọng tình yêu thương xung quanh bạn. Học cách buông bỏ những mâu thuẫn cũ còn sót lại.`,
          avoid: `Tiếp tục ôm hết trách nhiệm không cần thiết; không cho con cháu không gian tự lập; mang theo oán giận và chưa được tha thứ`
        },
        7: {
          career: `Giai đoạn chia sẻ sự khôn ngoan tích lũy cả đời. Trở thành cố vấn, người hướng dẫn tri thức, hoặc tiếp tục viết và nghiên cứu. Không cần chứng minh gì — chỉ cần chia sẻ.`,
          finance: `Đơn giản hóa hoàn toàn tài chính. Chuẩn bị di sản tri thức — sách, bài viết, chia sẻ trực tiếp — cũng quý giá không kém di sản vật chất. Đảm bảo dự phòng tài chính đủ dùng.`,
          health: `Thực hành tâm linh và nội tâm là ưu tiên hàng đầu. Duy trì thói quen thiền định và đọc sách. Tránh cô lập quá mức — kết nối xã hội có chọn lọc vẫn quan trọng.`,
          relationship: `Chia sẻ chiều sâu nội tâm với những người thực sự trân trọng nó. Đây là giai đoạn của các cuộc trò chuyện sâu sắc và kết nối tâm hồn. Học cách hiện diện hoàn toàn.`,
          avoid: `Cô lập hoàn toàn vì "không ai hiểu"; trở nên hoài nghi và xa cách; ôm giữ tri thức thay vì chia sẻ`
        },
        8: {
          career: `Giai đoạn xây dựng và trao truyền di sản. Chuyển hướng từ tích lũy sang tặng trao và phân phối khôn ngoan. Sử dụng ảnh hưởng để nâng đỡ thế hệ sau.`,
          finance: `Chuyển nguồn lực tài chính sang mục đích di sản — gia đình, từ thiện, đầu tư cho thế hệ sau. Chuẩn bị kế hoạch di sản hoàn chỉnh. Đơn giản hóa quản lý tài chính cá nhân.`,
          health: `Học cách buông bỏ gánh nặng tích lũy. Thiền định và các hoạt động giảm stress là quan trọng. Duy trì vận động nhẹ nhàng và đều đặn.`,
          relationship: `Sử dụng ảnh hưởng và sự kính trọng để nâng đỡ người xung quanh. Học cách nhận về từ người thân thay vì luôn là người cho. Nuôi dưỡng di sản tình người bên cạnh di sản vật chất.`,
          avoid: `Tiếp tục tích lũy không có mục đích di sản rõ ràng; xa cách con người vì tập trung vào quản lý tài sản; không thể buông bỏ quyền kiểm soát`
        },
        9: {
          career: `Giai đoạn phụng sự và đóng góp nhân văn ý nghĩa nhất. Tình nguyện, từ thiện, hỗ trợ cộng đồng là cách hoàn thành vòng tròn cuộc đời. Đây là thời gian trao đi mà không kỳ vọng đền đáp.`,
          finance: `Sắp xếp tài chính gọn gàng cho giai đoạn cuối đời. Cho đi những gì không cần thiết. Chuẩn bị di chúc và kế hoạch di sản rõ ràng để không gánh nặng cho người thân.`,
          health: `Học nghệ thuật buông bỏ — thể chất và tinh thần. Thực hành tha thứ và giải phóng những gánh nặng cũ. Giữ kết nối xã hội và tinh thần tích cực.`,
          relationship: `Tha thứ và hòa giải với những mâu thuẫn chưa được giải quyết. Tập trung vào những mối quan hệ thực sự quan trọng. Mở lòng nhận tình yêu thương từ người xung quanh.`,
          avoid: `Ôm giữ oán giận không tha thứ đến cuối đời; tiếp tục cố gánh những gì không còn cần thiết; từ chối nhận sự hỗ trợ và chăm sóc`
        },
        11: {
          career: `Giai đoạn tỏa sáng ánh sáng tâm linh và truyền cảm hứng một cách thầm lặng nhưng mạnh mẽ. Chia sẻ sự khôn ngoan tâm linh với những người tìm đến. Đây là sứ mệnh đích thực cuối cuộc đời.`,
          finance: `Đơn giản hóa hoàn toàn tài chính vật chất để tập trung vào di sản tinh thần. Đảm bảo nhu cầu cơ bản được đáp ứng. Giải phóng khỏi lo lắng vật chất để sống trọn vẹn hiện tại.`,
          health: `Duy trì thực hành tâm linh và thiền định hàng ngày. Quản lý năng lượng nhạy cảm bằng cách giới hạn tiếp xúc với năng lượng tiêu cực. Ngủ đủ và phục hồi sâu.`,
          relationship: `Trở thành ngọn đèn soi sáng cho những người đang tìm kiếm. Kết nối sâu sắc với những tâm hồn đồng điệu. Học cách hiện diện trọn vẹn trong từng khoảnh khắc gặp gỡ.`,
          avoid: `Thu mình vì lo lắng bản thân "không đủ"; bị kiệt sức vì tiếp nhận quá nhiều năng lượng người khác; không chia sẻ ánh sáng trí tuệ và tâm linh`
        },
        22: {
          career: `Giai đoạn nhìn lại di sản đã xây dựng và hoàn thành những gì còn dang dở. Trao truyền tầm nhìn cho thế hệ kế tiếp đủ tâm huyết. Đây là lúc trở thành người thầy vĩ đại nhất.`,
          finance: `Chuẩn bị di sản tài chính và tổ chức để tiếp tục vận hành sau khi bạn không còn điều hành trực tiếp. Đơn giản hóa cá nhân để tập trung vào di sản lớn. Đảm bảo tổ chức/hệ thống bạn xây dựng có thể tự vận hành.`,
          health: `Biết nghỉ ngơi và ủy quyền — không cần mang tất cả trên vai nữa. Học cách nhận sự hỗ trợ từ người khác. Duy trì sức khoẻ để hoàn thành sứ mệnh cuối.`,
          relationship: `Mở lòng nhận tình yêu và sự biết ơn từ người được ảnh hưởng bởi công trình của mình. Học cách hiện diện với những người thân thiết thay vì chỉ bận rộn với sứ mệnh lớn.`,
          avoid: `Kiệt sức trong khi vẫn cố nắm giữ mọi thứ; không ủy quyền và tin tưởng người kế thừa; mất kết nối hoàn toàn với đời sống cá nhân và gia đình`
        }
      }
    };

    const stage = stageLabels[cycleNum];
    const effectiveNum = (num === 11 || num === 22) ? num : (num % 9 || 9);
    const cycleData = deepNarrative[cycleNum] || deepNarrative[1];
    const baseNarr = cycleData[effectiveNum] || cycleData[effectiveNum % 9 || 9];
    const cycleAdvice = adviceData[cycleNum] || {};
    const adviceForNum = cycleAdvice[effectiveNum] || cycleAdvice[effectiveNum % 9 || 9] || null;
    const narr = adviceForNum ? { ...baseNarr, advice: adviceForNum } : baseNarr;

    const paragraphsHtml = narr.paragraphs.map((p: string) => `<p class="nar">${p}</p>`).join('\n      ');

    return `<div class="cycle-block">
      <div class="cycle-header">
        <span class="cycle-badge">${cycleNum}</span>
        <div>
          <div class="cycle-label">${stage.title} · <strong style="color:#c026d3">Số ${num}</strong> · <em>${period}</em></div>
          <div class="cycle-theme">Chủ đề: ${narr.theme}</div>
        </div>
      </div>
      ${paragraphsHtml}
      <div class="insight-box">📌 <strong>Bài học cốt lõi:</strong> ${narr.lesson}</div>
      ${narr.advice ? `<div class="lc-advice-box">
        <div class="lc-advice-title">💡 Lời Khuyên Thực Tiễn</div>
        <div class="lc-advice-grid">
          ${narr.advice.career ? `<div class="lc-advice-item">
            <div class="lc-advice-icon">💼</div>
            <div class="lc-advice-content">
              <div class="lc-advice-label">Sự nghiệp & Học hành</div>
              <div class="lc-advice-text">${narr.advice.career}</div>
            </div>
          </div>` : ''}
          ${narr.advice.finance ? `<div class="lc-advice-item">
            <div class="lc-advice-icon">💰</div>
            <div class="lc-advice-content">
              <div class="lc-advice-label">Tài chính</div>
              <div class="lc-advice-text">${narr.advice.finance}</div>
            </div>
          </div>` : ''}
          ${narr.advice.health ? `<div class="lc-advice-item">
            <div class="lc-advice-icon">🌿</div>
            <div class="lc-advice-content">
              <div class="lc-advice-label">Sức khỏe & Năng lượng</div>
              <div class="lc-advice-text">${narr.advice.health}</div>
            </div>
          </div>` : ''}
          ${narr.advice.relationship ? `<div class="lc-advice-item">
            <div class="lc-advice-icon">💗</div>
            <div class="lc-advice-content">
              <div class="lc-advice-label">Mối quan hệ</div>
              <div class="lc-advice-text">${narr.advice.relationship}</div>
            </div>
          </div>` : ''}
        </div>
        ${narr.advice.avoid ? `<div class="lc-advice-avoid"><span class="lc-avoid-label">⚠️ Cần tránh:</span> ${narr.advice.avoid}</div>` : ''}
      </div>` : ''}
    </div>`;
}

  // ════════════════════════════════════════════════════════════════════
  // NĂM/THÁNG CÁ NHÂN — deep narrative with domain advice
  // ════════════════════════════════════════════════════════════════════

export const LIFE_CYCLE_PHASE_EXTRA: Record<number, LifeCyclePhaseExtraEntry> = {
  1: {
    gieoHat: 'Năng lượng số 1 trong giai đoạn niên thiếu hình thành ở bạn tinh thần độc lập và xu hướng tự mình khám phá thế giới từ rất sớm. Bạn thường xuyên muốn thử nghiệm mọi thứ theo cách riêng của mình, dù đôi khi điều đó đồng nghĩa với việc va chắp thực tế. Đây là giai đoạn bạn xây dựng bản sắc cá nhân mạnh mẽ và lòng dũng cảm để tiên phong.',
    truongThanh: 'Bước vào trưởng thành, số 1 thúc đẩy bạn trở thành người dẫn đầu trong sự nghiệp và cuộc sống. Đây là giai đoạn lý tưởng để khởi nghiệp, đảm nhận vai trò lãnh đạo hoặc xây dựng nền tảng độc lập về tài chính. Thách thức là không để cái tôi cá nhân cản trở các mối quan hệ cộng tác.',
    vienMan: 'Ở giai đoạn viên mãn, số 1 tiếp tục thổi vào bạn ngọn lửa của sự độc lập và ý chí. Bạn không muốn nghỉ hưu theo nghĩa thông thường — những người số 1 ở giai đoạn này thường vẫn tiếp tục sáng tạo, đóng góp và dẫn đường cho thế hệ sau bằng kinh nghiệm và trí tuệ tích lũy cả đời.',
  },
  2: {
    gieoHat: 'Năng lượng số 2 trong thời niên thiếu tạo ra một tâm hồn nhạy cảm, giàu cảm xúc và yêu thương. Bạn thường học được cách lắng nghe và thấu cảm từ rất sớm. Gia đình và bạn bè là vũ trụ của bạn trong giai đoạn này — sự hài hòa trong các mối quan hệ là điều bạn luôn tìm kiếm và gìn giữ.',
    truongThanh: 'Giai đoạn trưởng thành với số 2 là thời gian các mối quan hệ trở thành trung tâm cuộc sống — hôn nhân, đối tác, cộng sự. Bạn xuất sắc trong vai trò là người hỗ trợ và kiến tạo sự kết nối. Thách thức là học cách đảm bảo nhu cầu của chính mình cũng được đáp ứng, không chỉ mải lo cho người khác.',
    vienMan: 'Số 2 trong giai đoạn viên mãn khơi dậy ở bạn chiều sâu tâm linh và nhu cầu hòa bình nội tâm. Đây là lúc bạn tổng kết hành trình bằng những mối quan hệ trọn vẹn. Vai trò trung gian, dàn xếp, chữa lành trong gia đình và cộng đồng là nơi bạn tỏa sáng nhất.',
  },
  3: {
    gieoHat: 'Số 3 trong giai đoạn niên thiếu biến bạn thành một đứa trẻ đầy màu sắc, ham thích khám phá và không thiếu bạn bè. Trí tưởng tượng phong phú, khiếu hài hước và năng lực biểu đạt ngôn ngữ phát triển rất sớm. Đây là giai đoạn bạn học cách kể chuyện, sáng tạo và giao tiếp với thế giới bằng tất cả sự hoan hỉ và tò mò tự nhiên.',
    truongThanh: 'Giai đoạn trưởng thành với số 3 là mùa bứt phá sáng tạo. Bạn giỏi nhất trong những lĩnh vực đòi hỏi ý tưởng và biểu đạt — viết, nói, thiết kế, giảng dạy, diễn xuất. Đây cũng là giai đoạn cần rèn thêm kỷ luật để hoàn thành những gì đã bắt đầu, tránh để tài năng rơi vào sự tản mạn.',
    vienMan: 'Số 3 trong giai đoạn viên mãn giữ cho tinh thần bạn trẻ trung và tươi mới bất kể tuổi tác. Bạn tiếp tục sáng tạo, chia sẻ và truyền cảm hứng cho người xung quanh. Đây là giai đoạn đặc biệt thuận lợi để viết hồi ký, truyền nghề, hoặc làm bất cứ điều gì để lại dấu ấn nghệ thuật.',
  },
  4: {
    gieoHat: 'Số 4 trong giai đoạn niên thiếu định hình nên một đứa trẻ cần cảm giác an toàn và có cấu trúc. Bạn thích quy tắc rõ ràng, thường nghiêm túc hơn bạn bè cùng tuổi và có xu hướng quan tâm đến sự thực tế. Nhà cửa gọn gàng, bài tập chu đáo và lối sống có trật tự là những điều bạn thấm sâu vào hành vi.',
    truongThanh: 'Trưởng thành với số 4 là giai đoạn của sự xây dựng bền vững — từ sự nghiệp, tài chính đến gia đình. Bạn làm việc chăm chỉ hơn hầu hết mọi người và thường đạt được thành tựu thực chất. Rủi ro lớn nhất là kiệt sức vì không biết nghỉ ngơi và bỏ lỡ những niềm vui thoáng qua.',
    vienMan: 'Ở giai đoạn viên mãn, số 4 cho bạn cảm giác hài lòng khi nhìn lại toàn bộ những điều đã xây dựng được. Đây là lúc khôn ngoan thực tiễn của bạn trở thành di sản quý giá nhất cho con cháu và những người xung quanh. Bạn là người giữ gìn truyền thống và nền tảng ổn định của gia đình.',
  },
  5: {
    gieoHat: 'Số 5 trong giai đoạn niên thiếu tạo ra một tâm hồn hiếu kỳ không ngừng nghỉ. Bạn chán ngán routine, thích thử nghiệm và yêu thích bất ngờ. Khả năng thích nghi nhanh với môi trường mới và kết bạn với nhiều kiểu người khác nhau là điểm mạnh nổi bật từ rất sớm.',
    truongThanh: 'Giai đoạn trưởng thành với số 5 là hành trình tìm kiếm tự do và đa dạng trải nghiệm. Sự nghiệp của bạn có thể trải rộng nhiều lĩnh vực, bao gồm du lịch, truyền thông, kinh doanh đa ngành. Thách thức là duy trì cam kết đủ lâu để tạo nên thành tựu có chiều sâu, thay vì cứ mãi bắt đầu những chương mới.',
    vienMan: 'Số 5 trong giai đoạn viên mãn tiếp tục giữ bạn năng động và cởi mở với cuộc sống. Bạn không bao giờ thực sự về hưu theo nghĩa cứng nhắc — luôn có chuyến đi mới, góc nhìn mới và mối quan hệ mới chờ đón. Đây là giai đoạn bạn chia sẻ những bài học từ hành trình phong phú của mình.',
  },
  6: {
    gieoHat: 'Số 6 trong giai đoạn niên thiếu hình thành một tâm hồn có trách nhiệm và quan tâm sâu sắc đến người thân. Bạn thường được xem là đứa trẻ ngoan và chín chắn, nhưng bên trong cũng mang nỗi lo lắng về sự hài lòng của người khác. Gia đình là trung tâm an toàn và quan trọng nhất của bạn.',
    truongThanh: 'Giai đoạn trưởng thành với số 6 hướng bạn mạnh mẽ về phía xây dựng gia đình và cộng đồng. Hôn nhân, con cái và mái ấm là trọng tâm của những năm này. Bạn đặc biệt tài năng trong bất kỳ nghề nào liên quan đến chăm sóc, chữa lành và tổ chức không gian sống.',
    vienMan: 'Số 6 trong giai đoạn viên mãn là thời gian bạn thu hoạch những gì đã vun trồng trong các mối quan hệ — con cháu tràn đầy yêu thương, gia đình hạnh phúc và cộng đồng gắn kết. Đây là giai đoạn viên mãn đúng nghĩa nhất cho những ai mang số 6, khi vai trò người chăm sóc trở thành di sản tình thương.',
  },
  7: {
    gieoHat: 'Số 7 trong giai đoạn niên thiếu tạo nên một đứa trẻ thích quan sát hơn tham gia, suy nghĩ nhiều hơn nói. Bạn có nội tâm phong phú, tò mò về những câu hỏi lớn từ rất sớm và thường cảm thấy khác biệt với bạn cùng lứa. Đây là giai đoạn quan trọng để phát triển trực giác và khả năng tư duy độc lập.',
    truongThanh: 'Giai đoạn trưởng thành với số 7 là hành trình đào sâu vào chuyên môn và tìm kiếm sự thật. Bạn xuất sắc trong nghiên cứu, phân tích và bất kỳ lĩnh vực nào cần tư duy chiều sâu. Có thể bạn gặp khó khăn trong việc mở lòng với các mối quan hệ gần gũi — đây là bài học cần thực hành có ý thức.',
    vienMan: 'Số 7 trong giai đoạn viên mãn là sự hội tụ của trí tuệ và tâm linh. Đây là thời điểm bạn đặt ra và trả lời những câu hỏi sâu xa nhất về ý nghĩa cuộc đời. Vai trò cố vấn, người hướng dẫn tri thức phù hợp tuyệt đối với bạn ở giai đoạn tích lũy trọn vẹn này.',
  },
  8: {
    gieoHat: 'Số 8 trong giai đoạn niên thiếu hình thành sự nhận thức về quyền lực, tiền bạc và thực tế từ rất sớm. Bạn thường có tham vọng cao hơn bạn đồng trang lứa và nhạy bén với những cơ hội. Đây là giai đoạn xây dựng ý chí và học cách sử dụng quyền lực một cách có trách nhiệm.',
    truongThanh: 'Trưởng thành với số 8 là giai đoạn của sức mạnh và thành tựu vật chất. Khả năng lãnh đạo, kinh doanh và quản lý tài nguyên của bạn phát triển mạnh mẽ. Đây là thời điểm lý tưởng để xây dựng sự nghiệp lớn — nhưng cũng là lúc dễ nhất để đánh mất sự cân bằng nếu chỉ chạy theo kết quả.',
    vienMan: 'Số 8 trong giai đoạn viên mãn mang đến thời gian để đánh giá lại giá trị thực sự của những gì đã tích lũy. Đây là giai đoạn chuyển hướng từ tích lũy sang sử dụng sức ảnh hưởng và tài nguyên để tạo ra di sản có ý nghĩa sâu xa hơn cho cộng đồng và gia đình.',
  },
  9: {
    gieoHat: 'Số 9 trong giai đoạn niên thiếu tạo nên tâm hồn cảm thụ mạnh mẽ và lòng trắc ẩn rộng lớn từ sớm. Bạn thường xúc động trước nỗi đau của người khác và có xu hướng muốn giúp đỡ mọi người. Đây cũng là giai đoạn bạn bắt đầu cảm nhận rằng mình có sứ mệnh gì đó lớn hơn bản thân.',
    truongThanh: 'Giai đoạn trưởng thành với số 9 là thời gian bạn bắt đầu đi tìm và sống theo sứ mệnh nhân văn của mình. Nghề nghiệp liên quan đến giáo dục, nghệ thuật, y tế hoặc xã hội thường phù hợp và thỏa mãn nhất. Thách thức là học cách buông bỏ và không ôm đồm quá nhiều.',
    vienMan: 'Số 9 trong giai đoạn viên mãn là thời gian hoàn thành vòng tròn — của việc trao đi và tiếp nhận. Đây là giai đoạn tâm linh mở rộng và ý nghĩa cuộc sống trở nên trong sáng hơn bao giờ hết. Bạn trở thành người chứng kiến khôn ngoan cho cuộc sống của những người xung quanh.',
  },
  11: {
    gieoHat: 'Số 11 (Số Master) trong giai đoạn niên thiếu tạo ra một đứa trẻ đặc biệt nhạy cảm, đôi khi bị cảm giác không thuộc về nơi này. Trực giác mạnh mẽ nhưng cũng dễ bị lo âu và quá tải cảm xúc. Đây là giai đoạn quan trọng để học cách bảo vệ năng lượng nội tâm và định hướng trực giác.',
    truongThanh: 'Số 11 trong giai đoạn trưởng thành là thời gian những tiềm năng đặc biệt bắt đầu được hiện thực hóa. Bạn có khả năng truyền cảm hứng và dẫn dắt người khác theo những con đường sáng tạo hoặc tâm linh. Thách thức là cân bằng giữa tầm nhìn cao cả và những đòi hỏi thực tế của cuộc sống.',
    vienMan: 'Số 11 trong giai đoạn viên mãn là đỉnh cao của hành trình nội tâm và sứ mệnh truyền cảm hứng. Đây là lúc những giác ngộ và hiểu biết tích lũy cả đời được biểu đạt trọn vẹn nhất. Bạn trở thành ngọn đèn soi sáng cho những ai đang tìm kiếm ý nghĩa sâu xa hơn trong cuộc sống.',
  },
  22: {
    gieoHat: 'Số 22 (Số Master) trong giai đoạn niên thiếu ươm mầm tư duy của một người xây dựng vĩ đại. Bạn thường có khả năng nhìn xa hơn và suy nghĩ quy mô lớn hơn người cùng tuổi. Đây là giai đoạn học cách biến tầm nhìn thành kế hoạch và kỷ luật để kiên trì theo đuổi những gì quan trọng.',
    truongThanh: 'Số 22 trong giai đoạn trưởng thành là thời gian bạn bắt đầu xây dựng những thứ có tầm ảnh hưởng thực sự — doanh nghiệp, tổ chức, hệ thống, hay bất cứ điều gì có thể tồn tại lâu dài hơn bản thân bạn. Đây là giai đoạn đỉnh cao và đòi hỏi tất cả sự tập trung và kỷ luật.',
    vienMan: 'Số 22 trong giai đoạn viên mãn nhìn lại một hành trình xây dựng với quy mô và chiều sâu hiếm có. Di sản bạn để lại là hệ thống, phong trào hay cộng đồng mà nhiều người tiếp tục thụ hưởng. Đây là giai đoạn của sự hoàn tất mãn nguyện.',
  },
  33: {
    gieoHat: 'Số 33 (Số Master) trong giai đoạn niên thiếu hình thành một tâm hồn yêu thương bao la và nhạy cảm vô cùng. Bạn thường cảm nhận nỗi đau của người khác như của chính mình từ khi còn nhỏ. Đây là giai đoạn học cách yêu thương có ranh giới lành mạnh để không bị kiệt sức bởi sự nhạy cảm quá mức.',
    truongThanh: 'Số 33 trong giai đoạn trưởng thành là thời gian bạn được gọi đến sứ mệnh chữa lành và phụng sự với quy mô lớn. Giáo dục, tâm linh, nghệ thuật chữa lành — bất cứ con đường nào nơi tình yêu thương của bạn có thể chạm đến và thay đổi cuộc sống của những người khác.',
    vienMan: 'Số 33 trong giai đoạn viên mãn là sự trở về với tình yêu vũ trụ — vô điều kiện, vô biên giới và vô hạn. Đây là giai đoạn những người mang Master số 33 thực sự trở thành hiện thân của tình thương trong cộng đồng xung quanh họ, chữa lành bằng chính sự hiện diện.',
  },

};

type LifeCycleStage = {
  cycle: PeriodIndicatorResult;
  index: number;
  icon: string;
  label: string;
  color: string;
  extraKey: keyof LifeCyclePhaseExtraEntry;
  title: string;
};

function parseLifeCyclePeriod(period: string): { startAge: number; endAge?: number } {
  const matches = period.match(/\d+/g)?.map(Number) ?? [];
  return { startAge: matches[0] ?? 0, endAge: matches[1] };
}

function formatAgeRange(startAge: number, endAge?: number): string {
  return typeof endAge === "number" ? `${startAge} - ${endAge} tuổi` : `${startAge} tuổi trở đi`;
}

function formatYearRange(birthYear: number, startAge: number, endAge?: number): string {
  const startYear = birthYear + startAge;
  return typeof endAge === "number" ? `${startYear} - ${birthYear + endAge}` : `${startYear} trở đi`;
}

export function buildLifeCyclesSection(report: NumerologyReport, name: string, detailLimit = 3): string {
  const safeName = escapeHtml(name);
  const birthYear = report.input.dobParts.year;
  const stages: LifeCycleStage[] = report.lifeCycles.slice(0, 3).map((cycle, index) => {
    const configs = [
      { icon: "🌱", label: "GIEO HẠT", color: "#4f46e5", extraKey: "gieoHat" as const, title: "Giai Đoạn 1 — Niên Thiếu (Gieo Hạt)" },
      { icon: "🌳", label: "CHÍN", color: "#7c3aed", extraKey: "truongThanh" as const, title: "Giai Đoạn 2 — Trưởng Thành (Chín)" },
      { icon: "🌾", label: "THU HOẠCH", color: "#c2410c", extraKey: "vienMan" as const, title: "Giai Đoạn 3 — Viên Mãn (Thu Hoạch)" },
    ];
    return { cycle, index, ...configs[index] };
  });

  const circles = stages
    .map((stage) => {
      const { startAge, endAge } = parseLifeCyclePeriod(stage.cycle.period);
      return `<div class="lc-circle-item">
        <div class="lc-circle" style="--lc-phase-color:${stage.color}">
          <div class="lc-stage-icon">${stage.icon}</div>
          <div class="lc-number">${stage.cycle.number}</div>
          <div class="lc-stage-name">${stage.label}</div>
          <div class="lc-age-range">${formatAgeRange(startAge, endAge)}</div>
          <div class="lc-year-range">${formatYearRange(birthYear, startAge, endAge)}</div>
        </div>
      </div>`;
    })
    .join("");

  const intro = `<div class="lc-intro-box">
    <p class="lc-intro-text">Cuộc đời mỗi người không trải ra như một đường thẳng, mà mở ra theo những mùa lớn của linh hồn. Ba chu kỳ đường đời cho thấy cách <strong>${safeName}</strong> được gieo mầm, trưởng thành và thu hoạch ý nghĩa qua từng giai đoạn khác nhau.</p>
    <p class="lc-intro-text"><strong>Gieo Hạt</strong> là giai đoạn hình thành căn tính đầu tiên — nơi những trải nghiệm tuổi thơ, gia đình, môi trường sống và bài học nền tảng đặt xuống những hạt giống sâu nhất trong tâm hồn.</p>
    <p class="lc-intro-text"><strong>Chín</strong> là giai đoạn trưởng thành và biểu hiện — nơi bạn bắt đầu dùng những gì đã học để xây dựng sự nghiệp, quan hệ, gia đình và vị trí của mình trong thế giới.</p>
    <p class="lc-intro-text"><strong>Thu Hoạch</strong> là giai đoạn viên mãn — nơi những lựa chọn, bài học và giá trị đã sống được cô đọng thành trí tuệ, di sản và sự bình an nội tâm.</p>
  </div>`;

  const details = stages
    .slice(0, Math.max(0, detailLimit))
    .map((stage) => {
      const { startAge, endAge } = parseLifeCyclePeriod(stage.cycle.period);
      const ageRange = formatAgeRange(startAge, endAge);
      const yearRange = formatYearRange(birthYear, startAge, endAge);
      const extra = LIFE_CYCLE_PHASE_EXTRA[stage.cycle.number]?.[stage.extraKey];
      return `<article class="lc-phase-block" style="--lc-phase-color:${stage.color}">
        <div class="lc-phase-header">
          <div class="lc-phase-title">${stage.icon} ${stage.title}</div>
          <div class="lc-phase-sub">Số ${stage.cycle.number} / ${ageRange} (${yearRange})</div>
        </div>
        <div class="lc-phase-body">
          ${extra ? `<div class="lc-phase-intro">${extra}</div>` : ""}
          ${lifeCycleNarrative(stage.index + 1, stage.cycle.number, `${ageRange} (${yearRange})`, name, stage.cycle.data as { theme?: string; cycle1?: string; cycle2?: string; cycle3?: string })}
        </div>
      </article>`;
    })
    .join("");

  return `<div class="lc-circle-row">${circles}</div>${intro}${details}`;
}
