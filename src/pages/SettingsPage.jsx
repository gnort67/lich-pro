import { useState } from "react";
import {
  Sun,
  Moon,
  MonitorSmartphone,
  Check,
  RotateCcw,
  Github,
  Info,
  Bell,
  BellOff,
  BellRing,
  CheckSquare,
  Square,
  ChevronDown,
  Shuffle,
  Sparkles,
  Droplets,
} from "lucide-react";
import Header from "../components/Header";
import Button from "../components/Button";
import Switch from "../components/Switch";
import {
  useSettings,
  COLOR_OPTIONS,
  FONT_OPTIONS,
  FONT_SIZE_OPTIONS,
} from "../contexts/SettingsContext";
import { useToast } from "../contexts/ToastContext";
import { useNotificationPermission } from "../hooks/useReminders";
import { HOLIDAYS, CATEGORY_LABEL } from "../data/holidays";
import { pad2 } from "../lib/dateUtils";

const THEME_MODES = [
  { id: "light", label: "Sáng", icon: Sun },
  { id: "dark", label: "Tối", icon: Moon },
  { id: "system", label: "Hệ thống", icon: MonitorSmartphone },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const BEFORE_DAYS_OPTIONS = [1, 2, 3, 5, 7];

export default function SettingsPage() {
  const { settings, effectiveColor, update, reset } = useSettings();
  const { notify } = useToast();
  const { permission, requestPermission, supported } =
    useNotificationPermission();
  const [requesting, setRequesting] = useState(false);
  const [holidayListOpen, setHolidayListOpen] = useState(false);

  function handleReset() {
    reset();
    notify("Đã khôi phục cài đặt mặc định.", {
      type: "info",
      title: "Cài đặt",
    });
  }

  async function handleToggleNotifications(next) {
    if (next) {
      setRequesting(true);
      const result = await requestPermission();
      setRequesting(false);
      if (result !== "granted") {
        notify(
          "Vui lòng cho phép quyền thông báo trong trình duyệt để sử dụng tính năng này.",
          {
            type: "warning",
            title: "Chưa được cấp quyền",
          },
        );
        return;
      }
      notify(
        "Bạn có thể chọn giờ, chế độ và ngày lễ muốn nhận thông báo bên dưới.",
        {
          type: "success",
          title: "Đã bật thông báo",
        },
      );
    }
    update({ notificationsEnabled: next });
  }

  function handleRandomColor() {
    const others = COLOR_OPTIONS.filter((c) => c.id !== settings.color);
    const pick =
      others[Math.floor(Math.random() * others.length)] ?? COLOR_OPTIONS[0];
    update({ color: pick.id, dailyColorRotation: false });
    notify(`Đã đổi sang màu ${pick.label}.`, { type: "success" });
  }

  const permissionLabel = !supported
    ? "Trình duyệt không hỗ trợ"
    : permission === "granted"
      ? "Đã cấp quyền"
      : permission === "denied"
        ? "Đã bị chặn — hãy bật lại trong cài đặt trình duyệt"
        : "Chưa cấp quyền";

  const selectedHolidayCount = settings.notifyHolidayIds.length;
  const allHolidaysSelected = selectedHolidayCount === HOLIDAYS.length;

  function toggleHoliday(id) {
    const set = new Set(settings.notifyHolidayIds);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    update({ notifyHolidayIds: Array.from(set) });
  }

  function toggleSelectAllHolidays() {
    update({
      notifyHolidayIds: allHolidaysSelected ? [] : HOLIDAYS.map((h) => h.id),
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pt-4 sm:px-6 sm:pt-8">
      <Header title="Cài đặt" subtitle="Tuỳ chỉnh giao diện" />
      <div className="hidden sm:mt-4 sm:block">
        <h1 className="text-2xl font-extrabold text-ink">Cài đặt</h1>
        <p className="text-sm text-ink-soft">
          Tuỳ chỉnh giao diện theo sở thích của bạn.
        </p>
      </div>

      {/* Chế độ giao diện */}
      <SettingsCard
        title="Chế độ giao diện"
        subtitle="Chọn giao diện sáng, tối hoặc theo hệ thống"
      >
        <div className="grid grid-cols-3 gap-2.5">
          {THEME_MODES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => update({ themeMode: id })}
              className={`focus-ring flex flex-col items-center gap-2 rounded-xl border py-3.5 transition-all duration-150 active:scale-95 ${
                settings.themeMode === id
                  ? "border-accent-500 bg-accent-50 text-accent-700 dark:bg-accent-100 dark:text-accent-300"
                  : "border-border text-ink-soft hover:border-accent-300 hover:-translate-y-0.5"
              }`}
              aria-pressed={settings.themeMode === id}
            >
              <Icon size={20} />
              <span className="text-xs font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </SettingsCard>

      {/* Màu sắc chủ đề */}
      <SettingsCard title="Màu sắc chủ đề" subtitle="Chọn một trong 8 tông màu">
        <div className="grid grid-cols-4 gap-x-2.5 gap-y-3.5 sm:grid-cols-8">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => update({ color: c.id, dailyColorRotation: false })}
              className="focus-ring flex flex-col items-center gap-1.5"
              aria-pressed={
                !settings.dailyColorRotation && settings.color === c.id
              }
              aria-label={c.label}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full shadow-soft ring-2 ring-offset-2 ring-offset-surface transition-transform duration-150 hover:scale-105 active:scale-90 sm:h-11 sm:w-11"
                style={{
                  backgroundColor: c.hex,
                  "--tw-ring-color":
                    !settings.dailyColorRotation && settings.color === c.id
                      ? c.hex
                      : "transparent",
                }}
              >
                {!settings.dailyColorRotation && settings.color === c.id && (
                  <Check size={16} className="text-white" strokeWidth={3} />
                )}
              </span>
              <span className="text-center text-[10px] font-medium leading-tight text-ink-soft">
                {c.label}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2.5 border-t border-border pt-4">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3.5">
            <div className="flex items-center gap-3">
              <Sparkles
                size={17}
                className={`shrink-0 ${settings.dailyColorRotation ? "text-accent-600 dark:text-accent-400" : "text-ink-faint"}`}
              />
              <div>
                <p className="text-sm font-semibold text-ink">
                  Đổi màu ngẫu nhiên mỗi ngày
                </p>
                <p className="text-[11px] text-ink-faint">
                  {settings.dailyColorRotation
                    ? `Hôm nay: ${COLOR_OPTIONS.find((c) => c.id === effectiveColor)?.label}`
                    : "Tự động xoay vòng qua 8 màu theo ngày"}
                </p>
              </div>
            </div>
            <Switch
              checked={settings.dailyColorRotation}
              onChange={(v) => update({ dailyColorRotation: v })}
              label="Đổi màu ngẫu nhiên mỗi ngày"
            />
          </div>
          <Button
            variant="secondary"
            size="md"
            icon={Shuffle}
            onClick={handleRandomColor}
            className="w-full"
          >
            Đổi màu ngẫu nhiên ngay
          </Button>
        </div>
      </SettingsCard>

      {/* Font chữ */}
      <SettingsCard
        title="Kiểu chữ"
        subtitle="Chọn 1 trong 5 font hiển thị, gồm 2 font thuần Việt quen thuộc"
      >
        <div className="flex flex-col gap-2">
          {FONT_OPTIONS.map((f) => (
            <button
              key={f.id}
              onClick={() => update({ font: f.id })}
              style={{ fontFamily: f.value }}
              className={`focus-ring flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors duration-150 ${
                settings.font === f.id
                  ? "border-accent-500 bg-accent-50 dark:bg-accent-100"
                  : "border-border hover:border-accent-300"
              }`}
              aria-pressed={settings.font === f.id}
            >
              <span>
                <span className="block text-sm font-bold text-ink">
                  {f.label}
                </span>
                <span className="block text-xs text-ink-faint">
                  Lịch Pro - Lịch âm dương Việt Nam
                </span>
              </span>
              {settings.font === f.id && (
                <Check
                  size={18}
                  className="shrink-0 text-accent-600 dark:text-accent-400"
                />
              )}
            </button>
          ))}
        </div>
      </SettingsCard>

      {/* Cỡ chữ */}
      <SettingsCard
        title="Cỡ chữ"
        subtitle="Điều chỉnh kích thước chữ và giao diện toàn ứng dụng"
      >
        <div className="grid grid-cols-4 gap-2">
          {FONT_SIZE_OPTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => update({ fontSize: s.id })}
              className={`focus-ring flex flex-col items-center gap-1 rounded-xl border py-3 transition-all duration-150 active:scale-95 ${
                settings.fontSize === s.id
                  ? "border-accent-500 bg-accent-50 text-accent-700 dark:bg-accent-100 dark:text-accent-300"
                  : "border-border text-ink-soft hover:border-accent-300"
              }`}
              aria-pressed={settings.fontSize === s.id}
            >
              <span
                style={{ fontSize: `${14 * s.scale}px` }}
                className="font-bold"
              >
                Aa
              </span>
              <span className="text-[10.5px] font-medium">{s.label}</span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink-soft">
          Xem trước:{" "}
          <span className="font-semibold">
            Thứ sáu, ngày 07 tháng 08 năm 2026
          </span>{" "}
          — toàn bộ chữ và khoảng cách sẽ co giãn theo cỡ đã chọn.
        </p>
      </SettingsCard>

      {/* Glassmorphism */}
      <SettingsCard
        title="Hiệu ứng kính mờ (Glassmorphism)"
        subtitle="Điều chỉnh độ mờ kính cho thanh điều hướng, popup, thông báo"
      >
        <div className="flex items-center gap-3">
          <Droplets size={18} className="shrink-0 text-accent-500" />
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={settings.glassIntensity}
            onChange={(e) => update({ glassIntensity: Number(e.target.value) })}
            className="h-2 w-full flex-1 cursor-pointer appearance-none rounded-full bg-border accent-accent-600"
            aria-label="Độ mờ kính"
          />
          <span className="w-11 shrink-0 text-right text-sm font-bold tabular-nums text-ink">
            {settings.glassIntensity}%
          </span>
        </div>
        <p className="mt-2.5 text-xs text-ink-faint">
          0% gần như trong suốt hoàn toàn, 100% mờ đục rõ nét nhất.
        </p>
      </SettingsCard>

      {/* Thông báo */}
      <SettingsCard
        title="Thông báo nhắc nhở"
        subtitle="Nhắc ngày chay, ngày rằm, mùng một và ngày lễ đặc biệt"
      >
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3.5">
          <div className="flex items-center gap-3">
            {settings.notificationsEnabled ? (
              <BellRing
                size={18}
                className="shrink-0 text-accent-600 dark:text-accent-400"
              />
            ) : (
              <BellOff size={18} className="shrink-0 text-ink-faint" />
            )}
            <div>
              <p className="text-sm font-semibold text-ink">Bật thông báo</p>
              <p className="text-[11px] text-ink-faint">
                {requesting ? "Đang yêu cầu quyền..." : permissionLabel}
              </p>
            </div>
          </div>
          <Switch
            checked={settings.notificationsEnabled}
            onChange={handleToggleNotifications}
            label="Bật thông báo nhắc nhở"
            disabled={requesting || !supported}
          />
        </div>

        {settings.notificationsEnabled && (
          <div className="mt-3 flex flex-col gap-3">
            {/* Giờ thông báo */}
            <div className="rounded-xl border border-border bg-surface p-3.5">
              <p className="mb-2.5 text-sm font-semibold text-ink">
                Giờ gửi thông báo
              </p>
              <div className="flex items-center gap-2">
                <select
                  value={settings.notifyHour}
                  onChange={(e) =>
                    update({ notifyHour: Number(e.target.value) })
                  }
                  className="focus-ring flex-1 rounded-lg border border-border bg-surface-raised px-2.5 py-2 text-sm font-semibold text-ink"
                  aria-label="Giờ"
                >
                  {HOURS.map((h) => (
                    <option key={h} value={h}>
                      {pad2(h)} giờ
                    </option>
                  ))}
                </select>
                <select
                  value={settings.notifyMinute}
                  onChange={(e) =>
                    update({ notifyMinute: Number(e.target.value) })
                  }
                  className="focus-ring flex-1 rounded-lg border border-border bg-surface-raised px-2.5 py-2 text-sm font-semibold text-ink"
                  aria-label="Phút"
                >
                  {MINUTES.map((m) => (
                    <option key={m} value={m}>
                      {pad2(m)} phút
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-2 text-[11px] text-ink-faint">
                Ứng dụng cần đang mở (hoặc chạy nền) vào/khi qua thời điểm này
                để gửi được thông báo.
              </p>
            </div>

            {/* Chế độ: đúng ngày hay báo trước */}
            <div className="rounded-xl border border-border bg-surface p-3.5">
              <p className="mb-2.5 text-sm font-semibold text-ink">
                Thời điểm nhắc
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => update({ notifyTiming: "on-day" })}
                  className={`focus-ring rounded-lg border py-2 text-xs font-semibold transition-colors ${
                    settings.notifyTiming === "on-day"
                      ? "border-accent-500 bg-accent-50 text-accent-700 dark:bg-accent-100 dark:text-accent-300"
                      : "border-border text-ink-soft"
                  }`}
                >
                  Đúng ngày diễn ra
                </button>
                <button
                  onClick={() => update({ notifyTiming: "before" })}
                  className={`focus-ring rounded-lg border py-2 text-xs font-semibold transition-colors ${
                    settings.notifyTiming === "before"
                      ? "border-accent-500 bg-accent-50 text-accent-700 dark:bg-accent-100 dark:text-accent-300"
                      : "border-border text-ink-soft"
                  }`}
                >
                  Báo trước
                </button>
              </div>
              {settings.notifyTiming === "before" && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {BEFORE_DAYS_OPTIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => update({ notifyBeforeDays: d })}
                      className={`focus-ring rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        settings.notifyBeforeDays === d
                          ? "border-accent-600 bg-accent-600 text-white"
                          : "border-border text-ink-soft"
                      }`}
                    >
                      Trước {d} ngày
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Ngày chay / rằm / mùng một */}
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3.5">
              <div>
                <p className="text-sm font-semibold text-ink">
                  Ngày Chay (Mùng Một &amp; Rằm)
                </p>
                <p className="text-[11px] text-ink-faint">
                  Nhắc mỗi khi đến 2 ngày ăn chay hàng tháng
                </p>
              </div>
              <Switch
                checked={settings.notifyLunarDays}
                onChange={(v) => update({ notifyLunarDays: v })}
                label="Nhắc ngày chay"
              />
            </div>

            {/* Danh sách ngày lễ tuỳ chọn */}
            <div className="rounded-xl border border-border bg-surface">
              <button
                onClick={() => setHolidayListOpen((v) => !v)}
                className="focus-ring flex w-full items-center justify-between gap-3 p-3.5 text-left"
                aria-expanded={holidayListOpen}
              >
                <div>
                  <p className="text-sm font-semibold text-ink">
                    Chọn ngày lễ muốn nhận thông báo
                  </p>
                  <p className="text-[11px] text-ink-faint">
                    Đã chọn {selectedHolidayCount}/{HOLIDAYS.length} ngày lễ
                  </p>
                </div>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-ink-faint transition-transform duration-200 ${holidayListOpen ? "rotate-180" : ""}`}
                />
              </button>

              {holidayListOpen && (
                <div className="border-t border-border">
                  <button
                    onClick={toggleSelectAllHolidays}
                    className="focus-ring flex w-full items-center gap-2 border-b border-border px-3.5 py-2.5 text-left text-xs font-semibold text-accent-600 dark:text-accent-400"
                  >
                    {allHolidaysSelected ? (
                      <CheckSquare size={15} />
                    ) : (
                      <Square size={15} />
                    )}
                    {allHolidaysSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                  </button>
                  <div className="max-h-72 overflow-y-auto">
                    {HOLIDAYS.map((h) => {
                      const checked = settings.notifyHolidayIds.includes(h.id);
                      return (
                        <button
                          key={h.id}
                          onClick={() => toggleHoliday(h.id)}
                          className="focus-ring flex w-full items-center gap-3 border-b border-border px-3.5 py-2.5 text-left last:border-b-0 hover:bg-surface-soft"
                          aria-pressed={checked}
                        >
                          {checked ? (
                            <CheckSquare
                              size={16}
                              className="shrink-0 text-accent-600 dark:text-accent-400"
                            />
                          ) : (
                            <Square
                              size={16}
                              className="shrink-0 text-ink-faint"
                            />
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-semibold text-ink">
                              {h.name}
                            </span>
                            <span className="block text-[10.5px] text-ink-faint">
                              {CATEGORY_LABEL[h.category]}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <ul className="mt-3 flex flex-col gap-1.5 text-xs text-ink-soft">
          <li className="flex items-center gap-2">
            <Bell size={12} className="shrink-0 text-accent-500" /> Thông báo áp
            dụng cho ngày chay và các ngày lễ bạn đã chọn ở trên
          </li>
        </ul>
      </SettingsCard>

      <div className="mt-5">
        <Button
          variant="secondary"
          icon={RotateCcw}
          onClick={handleReset}
          className="w-full"
        >
          Khôi phục mặc định
        </Button>
      </div>

      {/* Giới thiệu */}
      <SettingsCard title="Giới thiệu" className="mt-5">
        <div className="flex items-center gap-2 text-ink-soft">
          <Info size={16} />
          <p className="text-xs leading-relaxed">
            Lịch Pro — ứng dụng tra cứu lịch âm dương, lịch vạn niên và đếm
            ngược ngày lễ Việt Nam. Phiên bản 1.0.0.
          </p>
        </div>
        <div className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-ink-soft">
          <Github size={16} />
          <p className="text-xs">
            Được phát triển bởi{" "}
            <span className="font-semibold text-ink">minhtrong67</span>
          </p>
        </div>
      </SettingsCard>
    </div>
  );
}

function SettingsCard({ title, subtitle, children, className = "" }) {
  return (
    <section
      className={`hover-lift mt-4 rounded-2xl border border-border bg-surface-raised p-4 shadow-soft sm:mt-6 sm:p-5 ${className}`}
    >
      <h2 className="text-sm font-bold text-ink">{title}</h2>
      {subtitle && (
        <p className="mb-3.5 mt-0.5 text-xs text-ink-faint">{subtitle}</p>
      )}
      {!subtitle && <div className="mb-3.5" />}
      {children}
    </section>
  );
}
