"""
Generate the silent motion loop + poster for the smart metering blog post.

Renders the "Ontario smart metering ETL + VEE" hero diagram as an animated
data packet travelling: Smart Meter -> AMI Head-End -> MDM/R (Validate ->
Estimate -> Edit) -> fans out to Billing / IESO Settlement / Analytics.

Frames are drawn with PIL (no SVG rasterizer needed) and encoded with ffmpeg:

  python media-studio/gen_smart_metering_loop.py

Outputs:
  public/videos/blog/smart-metering-etl-vee-ontario-loop.mp4
  public/images/blog/smart-metering-etl-vee-ontario-poster.webp
"""
import math
import os
import subprocess
import tempfile

from PIL import Image, ImageDraw, ImageFont

W, H = 800, 400
FPS = 30
FRAMES = 96  # 3.2 s seamless loop

BG = (16, 27, 51, 255)
BOX = (26, 41, 71, 255)
GREEN = (16, 185, 129, 255)
GREEN_L = (52, 211, 153, 255)
BLUE = (0, 102, 255, 255)
BLUE_L = (96, 165, 250, 255)
RED = (239, 68, 68, 255)
RED_L = (248, 113, 113, 255)
AMBER = (245, 158, 11, 255)
AMBER_L = (251, 191, 36, 255)
TEXT = (226, 232, 240, 255)
MUT = (148, 163, 184, 255)
DIM = (100, 116, 139, 255)

FDIR = "C:/Windows/Fonts"


def font(name, size):
    path = os.path.join(FDIR, name)
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


F_BOLD = font("segoeuib.ttf", 15)
F_REG = font("segoeui.ttf", 11)
F_SMALL = font("segoeui.ttf", 9)
F_TINY = font("segoeui.ttf", 8)
F_MONO = font("consola.ttf", 9)
F_MONO_S = font("consola.ttf", 8)


def draw_scene(d, t):
    """Static scene + time-dependent highlights; packet drawn separately."""
    # background
    d.rectangle([0, 0, W, H], fill=BG)
    for x in range(0, W + 1, 40):
        d.line([(x, 0), (x, H)], fill=(16, 185, 129, 18))
    for y in range(0, H + 1, 40):
        d.line([(0, y), (W, y)], fill=(16, 185, 129, 18))

    # glows
    for r, a in ((280, 12), (200, 14), (130, 16)):
        d.ellipse([660 - r, 70 - int(r * 0.66), 660 + r, 70 + int(r * 0.66)], fill=(16, 185, 129, a))
    for r, a in ((280, 11), (200, 13), (130, 15)):
        d.ellipse([110 - r, 340 - int(r * 0.66), 110 + r, 340 + int(r * 0.66)], fill=(0, 102, 255, a))

    d.text((40, 42), "ONTARIO SMART METERING — ETL + VEE", font=F_MONO_S, fill=DIM)
    d.text((40, 382), "Working proposal — domain mapping from large-scale data engineering, not Ontario production data",
           font=F_TINY, fill=(71, 85, 105, 255))
    d.text((272, 172), "EXTRACT", font=F_MONO_S, fill=GREEN_L, anchor="mm")
    d.text((500, 258), "TRANSFORM = VEE", font=F_MONO_S, fill=BLUE_L, anchor="mm")
    d.text((712, 280), "LOAD", font=F_MONO_S, fill=AMBER_L, anchor="mm")

    # helper to draw a stage box + highlight
    def box(x0, y0, x1, y1, stroke, title, sub, active, title_col=TEXT):
        inten = stage_intensity(t, active)
        outline = stroke
        w = 2
        if inten > 0.05:
            w = int(2 + 2 * inten)
            d.ellipse([x0 - 8, y0 - 10, x1 + 8, y1 + 10], fill=(*stroke[:3], int(30 * inten)))
        d.rounded_rectangle([x0, y0, x1, y1], radius=8,
                            fill=(*BOX[:3], 255),
                            outline=(*outline[:3], int(140 + 115 * inten)), width=w)
        d.text(((x0 + x1) / 2, (y0 + y1) / 2 - 8), title, font=F_BOLD, fill=title_col, anchor="mm")
        d.text(((x0 + x1) / 2, (y0 + y1) / 2 + 9), sub, font=F_SMALL, fill=MUT, anchor="mm")

    # Smart Meter / AMI Head-End
    box(36, 96, 154, 152, GREEN, "Smart Meter", "interval reads", None)
    box(204, 96, 340, 152, GREEN, "AMI Head-End", "collectors · multi-vendor", None)
    d.line([(154, 124), (204, 124)], fill=(16, 185, 129, 130), width=2)
    d.polygon([(204, 124), (197, 120), (197, 128)], fill=(16, 185, 129, 130))
    d.line([(340, 124), (392, 124)], fill=(16, 185, 129, 130), width=2)
    d.polygon([(392, 124), (385, 120), (385, 128)], fill=(16, 185, 129, 130))

    # MDM/R shell
    d.rounded_rectangle([392, 60, 608, 244], radius=10, fill=BOX, outline=BLUE, width=2)
    d.text((408, 80), "MDM/R", font=F_BOLD, fill=TEXT)
    d.text((408, 97), "Meter Data Management & Repository", font=F_TINY, fill=MUT)
    d.rounded_rectangle([540, 70, 592, 90], radius=10, fill=(245, 158, 11, 31), outline=AMBER, width=1)
    d.text((566, 80), "VEE", font=F_SMALL, fill=AMBER_L, anchor="mm")

    # VEE stages
    box(408, 112, 592, 146, RED, "1 · Validate", "missing · zeros · neg · spikes · DST", (0.30, 0.50), RED_L)
    box(408, 154, 592, 188, GREEN, "2 · Estimate", "profile · neighbours · weather", (0.43, 0.57), GREEN_L)
    box(408, 196, 592, 230, AMBER, "3 · Edit", "overrides · swaps · audit trail", (0.50, 0.64), AMBER_L)
    for y0, y1 in ((146, 154), (188, 196)):
        d.line([(500, y0), (500, y1)], fill=DIM, width=2)
        d.polygon([(500, y1), (496, y1 - 6), (504, y1 - 6)], fill=DIM)
    d.text((500, 238), "stamp the audit trail", font=F_TINY, fill=DIM, anchor="mm")

    # consumers
    inten_cons = stage_intensity(t, (0.78, 0.93))
    cons = [("Billing", "TOU · ULO", 84), ("IESO Settlement", "wholesale market", 152), ("Analytics", "forecast · losses · CVR", 220)]
    for i, (title, sub, y) in enumerate(cons):
        if inten_cons > 0.05:
            d.ellipse([640, y - 10, 784, y + 50], fill=(245, 158, 11, int(28 * inten_cons)))
        d.rounded_rectangle([648, y, 776, y + 40], radius=8, fill=BOX,
                            outline=(*AMBER[:3], int(140 + 115 * inten_cons)), width=2)
        d.text((712, y + 17), title, font=F_REG, fill=TEXT, anchor="mm")
        d.text((712, y + 30), sub, font=F_TINY, fill=MUT, anchor="mm")
    d.line([(608, 124), (648, 104)], fill=(71, 85, 105, 255), width=2)
    d.line([(608, 152), (648, 172)], fill=(71, 85, 105, 255), width=2)
    d.line([(608, 216), (648, 240)], fill=(71, 85, 105, 255), width=2)


def stage_intensity(t, window):
    """Triangle pulse: 1 at window centre, 0 at window edges. None -> never."""
    if window is None:
        return 0.0
    c, w = window
    if t < c - w or t > c + w:
        return 0.0
    dist = abs(t - c) / w
    pulse = 0.75 + 0.25 * math.sin(t * math.pi * 6)
    return max(0.0, min(1.0, (1.0 - dist) * pulse))


def packet_alpha(t):
    if t < 0.06:
        return t / 0.06
    if t > 0.93:
        return max(0.0, (1.0 - t) / 0.07)
    return 1.0


SEGMENTS = [
    ((95, 124), (272, 124), 0.06, 0.20),
    ((272, 124), (392, 124), 0.20, 0.32),
    ((392, 124), (500, 129), 0.32, 0.45),
    ((500, 129), (500, 171), 0.45, 0.52),
    ((500, 171), (500, 213), 0.52, 0.59),
    ((500, 213), (608, 152), 0.59, 0.78),
]
FANOUT = [(712, 104), (712, 172), (712, 240)]


def packet_pos(t):
    if t < 0.06:
        return (95, 124)
    for (x0, y0), (x1, y1), ts, te in SEGMENTS:
        if ts <= t <= te:
            p = (t - ts) / (te - ts)
            return (x0 + (x1 - x0) * p, y0 + (y1 - y0) * p)
    return (608, 152)


def draw_packets(d, t):
    a = packet_alpha(t)
    if a <= 0.01:
        return
    # main packet
    x, y = packet_pos(t)
    d.ellipse([x - 12, y - 12, x + 12, y + 12], fill=(226, 232, 240, int(40 * a)))
    d.ellipse([x - 7, y - 7, x + 7, y + 7], fill=(16, 185, 129, int(160 * a)))
    d.ellipse([x - 4, y - 4, x + 4, y + 4], fill=(255, 255, 255, int(255 * a)))
    # fan-out
    if 0.78 <= t <= 0.90:
        p = (t - 0.78) / 0.12
        sx, sy = 608, 152
        for (cx, cy) in FANOUT:
            fx, fy = sx + (cx - sx) * p, sy + (cy - sy) * p
            d.ellipse([fx - 5, fy - 5, fx + 5, fy + 5], fill=(251, 191, 36, int(220 * a)))
            d.ellipse([fx - 2, fy - 2, fx + 2, fy + 2], fill=(255, 255, 255, int(255 * a)))


def render_frame(t):
    img = Image.new("RGBA", (W, H))
    d = ImageDraw.Draw(img)
    draw_scene(d, t)
    draw_packets(d, t)
    return img


def main():
    repo = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    tmp = tempfile.mkdtemp(prefix="smart-metering-frames-")
    for i in range(FRAMES):
        t = i / FRAMES
        render_frame(t).save(os.path.join(tmp, f"f_{i:03d}.png"))
    # poster = frame 0 (packet alpha 0), same as the loop's first frame
    render_frame(0.0).save(os.path.join(tmp, "poster.png"))

    loop_out = os.path.join(repo, "public", "videos", "blog", "smart-metering-etl-vee-ontario-loop.mp4")
    poster_out = os.path.join(repo, "public", "images", "blog", "smart-metering-etl-vee-ontario-poster.webp")
    os.makedirs(os.path.dirname(loop_out), exist_ok=True)

    subprocess.run([
        "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
        "-framerate", str(FPS), "-i", os.path.join(tmp, "f_%03d.png"),
        "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p",
        "-movflags", "+faststart", loop_out,
    ], check=True)
    subprocess.run([
        "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
        "-i", os.path.join(tmp, "poster.png"),
        "-c:v", "libwebp", "-quality", "88", poster_out,
    ], check=True)
    print("loop:", loop_out)
    print("poster:", poster_out)


if __name__ == "__main__":
    main()
