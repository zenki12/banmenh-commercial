import { useMemo, useState } from "react";
import { Button, Card } from "../../components/ui";
import type { TarotHistoryEntry } from "./tarot-history";

type TarotHistoryViewProps = {
  entries: TarotHistoryEntry[];
  onClear: () => void;
  onDelete: (id: string) => void;
  storageAvailable: boolean;
};

function formatTimestamp(timestamp: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

export function TarotHistoryView({ entries, onClear, onDelete, storageAvailable }: TarotHistoryViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | "all" | null>(null);
  const selected = useMemo(
    () => entries.find((entry) => entry.id === selectedId) ?? null,
    [entries, selectedId],
  );

  if (selected) {
    return (
      <TarotHistoryDetail
        entry={selected}
        onBack={() => {
          setPendingDelete(null);
          setSelectedId(null);
        }}
        onDelete={() => {
          if (pendingDelete !== selected.id) {
            setPendingDelete(selected.id);
            return;
          }
          onDelete(selected.id);
          setPendingDelete(null);
          setSelectedId(null);
        }}
        pendingDelete={pendingDelete === selected.id}
      />
    );
  }

  return (
    <div className="tarot-history">
      <p className="tarot-history-privacy" role="note">
        Lịch sử được lưu an toàn trên trình duyệt của bạn, không đồng bộ lên máy chủ công cộng.
      </p>

      {!storageAvailable ? (
        <p className="tarot-history-warning" role="status">
          Trình duyệt đang chặn bộ nhớ cục bộ. Bạn vẫn có thể trải bài, nhưng lịch sử có thể không được giữ sau khi đóng trang.
        </p>
      ) : null}

      {entries.length === 0 ? (
        <div className="tarot-modal-empty">
          <p>Chưa có phiên trải bài nào được lưu.</p>
          <p>Hoàn thành một lượt trải bài để thông điệp xuất hiện tại đây.</p>
        </div>
      ) : (
        <>
          <div className="tarot-history-list">
            {entries.map((entry) => (
              <article className="tarot-history-item" key={entry.id}>
                <button className="tarot-history-open" onClick={() => setSelectedId(entry.id)} type="button">
                  <div className="tarot-history-item-copy">
                    <time dateTime={entry.timestamp}>{formatTimestamp(entry.timestamp)}</time>
                    <strong>{entry.question}</strong>
                    <span>{entry.themeLabel} · {entry.spread} lá</span>
                  </div>
                  <div aria-label={`Các lá bài: ${entry.cards.map((card) => card.nameVi).join(", ")}`} className="tarot-history-thumbnails">
                    {entry.cards.map((card) => (
                      <img
                        alt={`${card.nameVi}, ${card.orientation === "upright" ? "xuôi" : "ngược"}`}
                        className={card.orientation === "reversed" ? "is-reversed" : ""}
                        key={`${entry.id}-${card.position}`}
                        loading="lazy"
                        src={card.imageSrc}
                      />
                    ))}
                  </div>
                </button>
                <button
                  className="tarot-history-delete"
                  onClick={() => {
                    if (pendingDelete === entry.id) {
                      onDelete(entry.id);
                      setPendingDelete(null);
                    } else {
                      setPendingDelete(entry.id);
                    }
                  }}
                  type="button"
                >
                  {pendingDelete === entry.id ? "Xác nhận xóa" : "Xóa lịch sử này"}
                </button>
              </article>
            ))}
          </div>

          <div className="tarot-history-clear">
            <Button onClick={() => {
              if (pendingDelete === "all") {
                onClear();
                setPendingDelete(null);
              } else {
                setPendingDelete("all");
              }
            }} variant="danger">
              {pendingDelete === "all" ? "Xác nhận xóa toàn bộ" : "Xóa toàn bộ lịch sử"}
            </Button>
            {pendingDelete ? (
              <Button onClick={() => setPendingDelete(null)} variant="ghost">Hủy thao tác xóa</Button>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}

function TarotHistoryDetail({
  entry,
  onBack,
  onDelete,
  pendingDelete,
}: {
  entry: TarotHistoryEntry;
  onBack: () => void;
  onDelete: () => void;
  pendingDelete: boolean;
}) {
  return (
    <div className="tarot-history-detail">
      <Button onClick={onBack} size="sm" variant="secondary">Quay lại danh sách</Button>
      <div className="tarot-history-detail-heading">
        <time dateTime={entry.timestamp}>{formatTimestamp(entry.timestamp)}</time>
        <h3>{entry.question}</h3>
        <p>{entry.themeLabel} · Trải {entry.spread} lá · {entry.source === "gemini" ? "Bản giải mã chuyên sâu" : "Bản giải mã nền tảng"}</p>
      </div>

      <Card className="tarot-history-reading-section" padding="md" variant="glass">
        <h4>Lời Hồi Đáp Từ Vũ Trụ</h4>
        <p>{entry.reading.overview}</p>
      </Card>

      <div className="tarot-history-detail-cards">
        {entry.reading.cards.map((reading, index) => {
          const card = entry.cards[index];
          return (
            <Card className="tarot-history-detail-card" key={`${entry.id}-${reading.position}`} padding="md" variant="glass">
              {card ? (
                <img
                  alt={`${card.nameVi}, ${card.orientation === "upright" ? "xuôi" : "ngược"}`}
                  className={card.orientation === "reversed" ? "is-reversed" : ""}
                  src={card.imageSrc}
                />
              ) : null}
              <div>
                <span>{reading.position}</span>
                <h4>{reading.cardName}</h4>
                <p>{reading.interpretation}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="tarot-history-reading-section" padding="md" variant="glass">
        <h4>Sự Mặc Khải</h4>
        <p>{entry.reading.synergy}</p>
      </Card>
      <Card className="tarot-history-reading-section" padding="md" variant="glass">
        <h4>Hành Động Định Mệnh</h4>
        <ul>{entry.reading.advice.map((item) => <li key={item}>{item}</li>)}</ul>
      </Card>

      <p className="tarot-history-disclaimer">
        Thông điệp mang tính chất chiêm nghiệm và định hướng tinh thần, không thay thế lời khuyên y tế, tài chính hay pháp lý.
      </p>
      <Button onClick={onDelete} variant="danger">
        {pendingDelete ? "Xác nhận xóa lịch sử này" : "Xóa lịch sử này"}
      </Button>
    </div>
  );
}
