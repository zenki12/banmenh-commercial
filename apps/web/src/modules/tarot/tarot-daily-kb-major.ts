import type { TarotDailyCardMeaning } from "./tarot-daily-kb";

export const TAROT_DAILY_MAJOR: Record<number, TarotDailyCardMeaning> = {
  "0": {
    "id": 0,
    "nameEn": "The Fool",
    "nameVi": "Kẻ Ngốc",
    "upright": "Tựa như nụ hoa e ấp chực chờ bung nở, The Fool mang đến nguồn năng lượng tinh khôi của những khởi đầu mới và tiềm năng vô hạn. Đây là khoảnh khắc vũ trụ vẫy gọi bạn rũ bỏ những gánh nặng của quá khứ, ôm trọn niềm tin thuần khiết và dũng cảm dấn bước vào một hành trình vạn dặm chưa từng được khám phá.",
    "reversed": "Khi đảo ngược, lá bài là lời cảnh tỉnh dịu dàng về sự liều lĩnh bốc đồng và những quyết định thiếu vắng sự suy xét. Đừng để sự ngây thơ biến thành tấm rèm che mắt bạn trước những rủi ro đang chực chờ; hãy dừng lại một nhịp để quan sát trước khi gieo mình xuống thung lũng.",
    "advice": "Hãy dũng cảm dang rộng đôi cánh để đón gió, nhưng đừng quên cúi nhìn mặt đất dưới chân. Sự tự do đích thực luôn đi kèm với ý thức trách nhiệm."
  },
  "1": {
    "id": 1,
    "nameEn": "The Magician",
    "nameVi": "Pháp Sư",
    "upright": "The Magician là hiện thân rực rỡ của quyền năng sáng tạo và ý chí sắt đá. Mọi nguyên tố của vũ trụ đều đang hội tụ trong tầm tay bạn. Đây là thời khắc chín muồi để thôi mộng mơ và bắt đầu xắn tay áo lên, biến những ý tưởng vô hình thành những thành tựu hữu hình rực rỡ.",
    "reversed": "Khi năng lượng bị đảo ngược, lá bài phản chiếu những mảng tối của sự thao túng, lừa lọc hoặc những tài năng đang bị để cho hoài phí. Bạn có thể đang thiếu đi sự tập trung cốt lõi, hoặc đang dệt nên những ảo ảnh để tự lừa dối chính bản thân mình.",
    "advice": "Quyền năng sáng tạo nằm trong chính tư duy của bạn. Hãy tập trung ý chí như một tia laser và biến mọi khát vọng thành hiện thực."
  },
  "2": {
    "id": 2,
    "nameEn": "The High Priestess",
    "nameVi": "Nữ Tư Tế",
    "upright": "Tĩnh lặng như bóng đêm, sâu thẳm như đại dương, Nữ Tư Tế (The High Priestess) là người nắm giữ chiếc chìa khóa mở ra cánh cửa của tri thức huyền bí và trực giác thiêng liêng. Đã đến lúc bạn ngừng tìm kiếm câu trả lời từ thế giới xô bồ ngoài kia, lùi lại một bước và lắng nghe tiếng thì thầm cất lên từ chính cõi lòng mình.",
    "reversed": "Một bức màn sương mù đang che khuất tầm nhìn. Bạn đang để những tiếng ồn ào của đám đông lấn át đi tiếng nói trực giác, hoặc đang cố tình ngoảnh mặt làm ngơ trước những bí mật đầy góc khuất vừa bị phơi bày.",
    "advice": "Đừng vội vàng hành động khi bức màn bí mật chưa được vén lên. Sự tĩnh lặng và trực giác nhạy bén chính là tấm khiên vững chắc nhất của bạn lúc này."
  },
  "3": {
    "id": 3,
    "nameEn": "The Empress",
    "nameVi": "Nữ Hoàng",
    "upright": "The Empress là hiện thân rạng rỡ của Đất Mẹ, ngọn nguồn của sự sống, sắc đẹp và tình yêu thương vô điều kiện. Lá bài mang đến luồng sinh khí của mùa xuân, báo hiệu một thời kỳ gặt hái thành quả viên mãn, nơi mọi hạt giống bạn gieo trồng đều đang đơm hoa kết trái rực rỡ.",
    "reversed": "Khi đảo ngược, dòng chảy của sự nuôi dưỡng bị tắc nghẽn. Bạn có thể đang hao mòn sinh lực vì ôm đồm quá nhiều trách nhiệm của người khác mà bỏ bê việc chăm sóc chính mình, hoặc đang kìm hãm sự phát triển bởi thói quen ỷ lại, phụ thuộc.",
    "advice": "Hãy mở rộng vòng tay ôm lấy sự phong phú của vũ trụ, nhưng đừng quên tưới tắm cho khu vườn tâm hồn của chính mình. Tình yêu thương vĩ đại nhất bắt đầu từ việc yêu thương bản thân."
  },
  "4": {
    "id": 4,
    "nameEn": "The Emperor",
    "nameVi": "Hoàng Đế",
    "upright": "Ngự trị trên ngai vàng vững chãi, The Emperor là biểu tượng tối cao của quyền uy, trật tự và kỷ luật thép. Đã đến lúc bạn cất đi sự mềm yếu, dùng lý trí sắc bén và tầm nhìn chiến lược để thiết lập những quy tắc vững vàng, bảo vệ vương quốc của riêng mình.",
    "reversed": "Sự sụp đổ của một đế chế thu nhỏ. Bạn đang trở nên cứng nhắc, độc tài, dùng uy quyền để áp bức người khác; hoặc ngược lại, đánh mất hoàn toàn khả năng kiểm soát, để cuộc đời trôi dạt trong sự vô kỷ luật.",
    "advice": "Đừng để cảm xúc lấn át lý trí. Hãy thiết lập ranh giới rõ ràng, giữ vững kỷ luật và trở thành người cai trị thông thái nhất cho vương quốc cuộc đời bạn."
  },
  "5": {
    "id": 5,
    "nameEn": "The Hierophant",
    "nameVi": "Giáo Hoàng",
    "upright": "Chiếc chìa khóa của những trí tuệ ngàn năm đang được The Hierophant trao cho bạn. Lá bài đại diện cho những giá trị truyền thống, hệ thống niềm tin tôn giáo và sự dẫn dắt của những bậc thầy. Đây là lúc tìm kiếm chân lý thông qua những con đường đã được thời gian kiểm chứng.",
    "reversed": "Một khao khát mãnh liệt muốn đập tan những xiềng xích của lề thói cũ. Bạn không còn muốn đi theo đám đông hay tuân phục những quy tắc lỗi thời. Đây là sự nổi loạn để đi tìm hệ giá trị đích thực của riêng mình.",
    "advice": "Đôi khi con đường mòn lại là con đường an toàn nhất. Hãy lắng nghe lời khuyên từ những bậc tiền bối, nhưng đừng đánh mất đi tiếng nói của lương tri."
  },
  "6": {
    "id": 6,
    "nameEn": "The Lovers",
    "nameVi": "Tình Nhân",
    "upright": "Dưới sự chúc phúc của thiên thần, The Lovers vẫy gọi một sự hòa quyện tuyệt đẹp giữa hai tâm hồn. Đây không chỉ là khúc tình ca lãng mạn mà còn là ngã rẽ định mệnh, nơi bạn phải đưa ra lựa chọn trọng đại bằng chính trái tim và hệ giá trị cốt lõi của mình.",
    "reversed": "Sự mất kết nối và những âm điệu lạc nhịp đang phá vỡ bản hòa ca. Bạn có thể đang vật lộn với những mâu thuẫn nội tâm dai dẳng, hoặc đang trốn tránh trách nhiệm cho những sai lầm trong lựa chọn của chính mình.",
    "advice": "Dù đứng trước bất kỳ ngã rẽ nào, hãy để trái tim thuần khiết và sự trung thực tuyệt đối dẫn lối cho bạn."
  },
  "7": {
    "id": 7,
    "nameEn": "The Chariot",
    "nameVi": "Cỗ Xe",
    "upright": "Cỗ Xe vinh quang (The Chariot) lao về phía trước mang theo sức mạnh của ý chí sắt đá và sự tập trung cao độ. Mọi rào cản sẽ bị nghiền nát dưới bánh xe nếu bạn biết cách làm chủ và cầm cương điều khiển những nguồn năng lượng đối lập bên trong mình.",
    "reversed": "Bánh xe trượt khỏi đường ray. Bạn đang đánh mất quyền kiểm soát cuộc đời mình, để cho ngoại cảnh và những cảm xúc hỗn mang cuốn trôi, hoặc đang đâm đầu mù quáng vào một ngõ cụt.",
    "advice": "Hãy nắm chặt dây cương, tập trung ánh nhìn vào đích đến và đừng để bất kỳ ai can thiệp vào tay lái của bạn."
  },
  "8": {
    "id": 8,
    "nameEn": "Strength",
    "nameVi": "Sức Mạnh",
    "upright": "Strength không phô trương sức mạnh bằng gươm giáo, mà rực sáng bởi lòng can đảm, kiên nhẫn và đức từ bi sâu thẳm. Lấy nhu thắng cương, bạn hoàn toàn có thể thuần hóa mọi dã thú trong nghịch cảnh bằng sự bao dung và dịu dàng.",
    "reversed": "Sự yếu mềm xâm chiếm tâm hồn. Nỗi sợ vô hình, sự tự ti và cảm xúc bùng nổ đang biến bạn thành nạn nhân của chính những bản năng nguyên thủy bên trong mình.",
    "advice": "Sức mạnh vĩ đại nhất luôn được gói ghém trong sự dịu dàng. Hãy dùng lòng bao dung để thuần phục thế giới."
  },
  "9": {
    "id": 9,
    "nameEn": "The Hermit",
    "nameVi": "Ẩn Sĩ",
    "upright": "Cầm ngọn đèn chân lý trên tay, Ẩn Sĩ (The Hermit) vẫy gọi bạn bước vào khoảng lặng tĩnh mịch. Đã đến lúc gác lại ồn ào xô bồ thế gian, lùi sâu vào hang động nội tâm tự vấn và tìm ra ánh sáng dẫn đường cho chặng hành trình sắp tới.",
    "reversed": "Một sự cô lập cực đoan đến mức tuyệt vọng. Bạn đang xây những bức tường quá cao để nhốt mình lại, hoặc từ chối lắng nghe lời khuyên khôn ngoan từ bậc tiền bối vì sự cố chấp tột độ.",
    "advice": "Câu trả lời bạn mỏi mắt kiếm tìm không nằm ở thế giới ngoài kia, nó đang ngủ quên ngay trong sâu thẳm tâm hồn bạn."
  },
  "10": {
    "id": 10,
    "nameEn": "Wheel of Fortune",
    "nameVi": "Bánh Xe Số Phận",
    "upright": "Bánh xe định mệnh (Wheel of Fortune) không bao giờ ngừng quay. Lá bài là cái gật đầu của vũ trụ, báo hiệu bước ngoặt mang tính luân hồi, nơi những may mắn bất ngờ và cơ hội vàng son ập đến thay đổi hoàn toàn cục diện cuộc đời bạn.",
    "reversed": "Bánh xe quay vào vòng lặp u ám. Cảm giác bất lực khi mọi thứ trượt khỏi tầm tay, xui xẻo liên tiếp giáng xuống. Nhưng hãy nhớ, dưới đáy bánh xe, điểm tiếp theo chỉ có thể là đi lên.",
    "advice": "Dù bánh xe đưa bạn lên đỉnh vinh quang hay dìm xuống vực thẳm, hãy giữ tâm bất biến giữa dòng đời vạn biến. Mọi thứ rồi sẽ qua đi."
  },
  "11": {
    "id": 11,
    "nameEn": "Justice",
    "nameVi": "Công Lý",
    "upright": "Dưới cán cân công lý của Justice, sự thật luôn được hiển bày. Mọi hành động đều được đong đếm bởi luật Nhân Quả. Lá bài yêu cầu sự minh bạch, trung thực và lòng can đảm để đối diện với những phán quyết công bằng nhất của vũ trụ.",
    "reversed": "Bóng tối của sự bất công, dối trá và lảng tránh trách nhiệm. Bạn có thể là nạn nhân của sự thiên vị cay nghiệt, hoặc chính bạn đang chối bỏ hậu quả từ sai lầm mà mình gieo rắc.",
    "advice": "Sự thật là ánh sáng không thể bị che khuất. Hãy hành xử với trái tim ngay thẳng, và vũ trụ sẽ trao cho bạn sự công bằng."
  },
  "12": {
    "id": 12,
    "nameEn": "The Hanged Man",
    "nameVi": "Người Treo Ngược",
    "upright": "Người Treo Ngược (The Hanged Man) là vũ điệu của tĩnh lặng và hy sinh tự nguyện. Lá bài yêu cầu buông bỏ sự kiểm soát cố chấp, đảo ngược góc nhìn đón nhận khai sáng. Sự đình trệ tạm thời ươm mầm cho nhận thức vĩ đại.",
    "reversed": "Vùng vẫy vô vọng trong bế tắc. Bạn bám víu định kiến cũ kỹ, từ chối hy sinh hoặc đóng vai nạn nhân. Sự trì hoãn kéo dài hao mòn nhuệ khí mà không mang lại bất kỳ giác ngộ nào.",
    "advice": "Đôi khi, việc không làm gì cả lại là hành động mạnh mẽ nhất. Hãy buông tay để rơi tự do vào sự tĩnh lặng của sự giác ngộ."
  },
  "13": {
    "id": 13,
    "nameEn": "Death",
    "nameVi": "Cái Chết",
    "upright": "Tiếng gọi của sự lột xác vĩ đại. Death không phải là cái chết vật lý, mà là lưỡi hái thanh trừng những thứ mục nát, cằn cỗi để dọn đường cho mầm sống mới nảy sinh. Một sự kết thúc không thể tránh khỏi để linh hồn được luân hồi và tái sinh rực rỡ.",
    "reversed": "Kháng cự tuyệt vọng trước bánh xe thời gian. Bạn đang níu kéo những thói quen, mối quan hệ hay niềm tin đã chết yểu. Việc từ chối buông tay chỉ làm cho quá trình chuyển hóa thêm đau đớn và dai dẳng.",
    "advice": "Giống như con rắn lột xác, đau đớn là tất yếu. Hãy dũng cảm buông bỏ những gì đã úa tàn để đón nhận sự sống mới."
  },
  "14": {
    "id": 14,
    "nameEn": "Temperance",
    "nameVi": "Tiết Chế",
    "upright": "Temperance là thuật giả kim của tâm hồn, pha trộn những yếu tố đối lập tạo nên hỗn hợp cân bằng tuyệt mỹ. Lá bài khuyên giữ sự trung dung, điềm tĩnh và kiên nhẫn. Mọi vết thương sẽ được chữa lành khi dòng chảy cuộc sống điều hòa nhịp nhàng.",
    "reversed": "Sự xáo trộn, cực đoan và mất kiềm chế. Bạn chạy theo những thái cực bốc đồng, ăn xài vô độ hoặc để cảm xúc hỗn loạn dẫn dắt. Lời cảnh báo đanh thép về sự dư thừa đang phá hủy cuộc sống.",
    "advice": "Đừng vội vã. Hãy là vị giả kim thuật của đời mình, từ từ pha trộn những mảnh ghép tìm ra điểm cân bằng hoàn hảo nhất."
  },
  "15": {
    "id": 15,
    "nameEn": "The Devil",
    "nameVi": "Ác Quỷ",
    "upright": "The Devil giăng ra những chiếc bẫy ngọt ngào của dục vọng, sự cám dỗ và xiềng xích vật chất. Tuy nhiên, sợi xích ấy rất lỏng lẻo; bạn tự nhốt mình bằng những ảo ảnh sợ hãi trong tâm trí.",
    "reversed": "Ánh bình minh phá tan xiềng xích. Cuối cùng đã thức tỉnh, dũng cảm đối diện phần tối (shadow) của mình, cắt đứt sự bám víu độc hại và giành lại sự tự do thiêng liêng cho linh hồn.",
    "advice": "Xiềng xích không nằm ở đôi tay, mà nằm trong tâm trí. Hãy nhìn thẳng vào bóng tối, nhận ra quyền năng của mình và tự do bước đi."
  },
  "16": {
    "id": 16,
    "nameEn": "The Tower",
    "nameVi": "Tòa Tháp",
    "upright": "Tia sét của vũ trụ giáng xuống, phá nát những nền móng mục rỗng. The Tower mang đến cú sốc đột ngột, thảm họa tàn khốc phá vỡ vỏ bọc an toàn. Nhưng qua đống tro tàn, không gian được làm sạch để xây dựng lại cuộc đời vững bền hơn.",
    "reversed": "Sống trong sợ hãi, bấu víu vách tường đang nứt toác để trì hoãn sự sụp đổ tất yếu. Việc né tránh nỗi đau chỉ làm quả bom nổ chậm thêm phần sức công phá. Hãy để mọi thứ vỡ tan.",
    "advice": "Đừng khóc than cho một nền móng đã thối nát. Hãy đón nhận cơn bão, quét sạch tàn dư và kiêu hãnh xây lại một lâu đài kiên cố hơn."
  },
  "17": {
    "id": 17,
    "nameEn": "The Star",
    "nameVi": "Ngôi Sao",
    "upright": "Sau cơn dông bão Tòa Tháp, ánh sao băng của The Star mang theo dòng suối mát lành của sự hy vọng, phục hồi và niềm tin bất diệt. Linh hồn bạn trần trụi, thuần khiết và đang được vũ trụ dịu dàng chữa lành mọi vết thương.",
    "reversed": "Bầu trời đêm không sao. Sự tuyệt vọng, bi quan và bóng tối bủa vây tâm trí. Bạn đang cạn kiệt niềm tin vào bản thân và phớt lờ dòng suối chữa lành đang chảy róc rách ngay bên cạnh.",
    "advice": "Hãy trút bỏ mọi muộn phiền, mở rộng trái tim và đón nhận dòng suối chữa lành. Vũ trụ luôn yêu thương và bảo bọc bạn."
  },
  "18": {
    "id": 18,
    "nameEn": "The Moon",
    "nameVi": "Mặt Trăng",
    "upright": "Dưới ánh sáng mờ ảo The Moon, tiềm thức, giấc mơ và nỗi sợ hãi nguyên thủy đang trỗi dậy. Mọi thứ mờ ảo, đầy rẫy ảo ảnh và dối trá. Đừng vội vã quyết định, hãy dùng trực giác soi đường qua vùng đầm lầy tăm tối.",
    "reversed": "Làn sương mù dày đặc dần tan biến. Những bí mật đen tối, lừa lọc hay ám ảnh tâm lý đang phơi bày ra ánh sáng rực rỡ. Đã đến lúc thoát khỏi vũng lầy hoang tưởng đối diện hiện thực rõ ràng.",
    "advice": "Khi mắt trần không thể nhìn xuyên qua màn sương, hãy nhắm mắt lại và để ánh sáng của trực giác dẫn lối."
  },
  "19": {
    "id": 19,
    "nameEn": "The Sun",
    "nameVi": "Mặt Trời",
    "upright": "The Sun tỏa ánh hào quang chói lọi, sưởi ấm mọi ngóc ngách cuộc sống. Lá bài là bản giao hưởng rực rỡ của viên mãn, niềm vui thuần khiết, sức sống mãnh liệt và thành công tột đỉnh. Bóng tối u ám đã bị xua tan hoàn toàn.",
    "reversed": "Những đám mây bay ngang qua bầu trời nắng. Mọi thứ vẫn rất tốt đẹp, chỉ là niềm vui bị trì hoãn một chút, hoặc cái tôi quá lớn khiến bạn không thể tận hưởng trọn vẹn. Đừng để sự bi quan làm lu mờ ánh sáng.",
    "advice": "Hãy bung nở rực rỡ như đóa hướng dương đón nắng. Bạn hoàn toàn xứng đáng với những đặc ân rực rỡ nhất mà vũ trụ ban tặng."
  },
  "20": {
    "id": 20,
    "nameEn": "Judgement",
    "nameVi": "Phán Xét",
    "upright": "Tiếng kèn thiên sứ vang lên, đánh thức linh hồn từ nấm mồ. Judgement là sự tái sinh vĩ đại, tiếng gọi thiêng liêng nội tâm hối thúc rũ bỏ lỗi lầm quá khứ. Đã đến lúc đánh giá lại cuộc đời, tha thứ và bước sang chương sống giác ngộ.",
    "reversed": "Sự cắn rứt lương tâm và tự phán xét tàn nhẫn. Khước từ tiếng gọi thức tỉnh, lảng tránh lỗi lầm cũ và giam mình trong sợ hãi, không dám bứt phá làm lại từ đầu.",
    "advice": "Quá khứ không phải là ngục tù. Hãy vị tha, lắng nghe tiếng kèn thức tỉnh và dũng cảm cất bước tái sinh."
  },
  "21": {
    "id": 21,
    "nameEn": "The World",
    "nameVi": "Thế Giới",
    "upright": "Vòng nguyệt quế của The World khép lại một đại chu kỳ rực rỡ. Lá bài là bản thánh ca của sự hoàn thành, viên mãn và trọn vẹn tột đỉnh. Cuộc hành trình cán vạch đích thành công, bạn đã hòa làm một với vũ trụ, sẵn sàng tận hưởng quả ngọt.",
    "reversed": "Bạn đã đi được 99% chặng đường, nhưng sự trì hoãn, thiếu tập trung hay nỗi sợ hãi vạch đích khiến mọi thứ bị bỏ dở giữa chừng. Sự chưa trọn vẹn này để lại cảm giác bứt rứt, hụt hẫng không nguôi.",
    "advice": "Hãy ăn mừng chiến thắng vĩ đại này. Một vòng tròn đã khép lại, để chuẩn bị cho một vòng tròn mới, bao la hơn, bắt đầu."
  }
};
