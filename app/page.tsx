'use client';

import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export default function HRPosterPage() {
  // ===== Overlapped Carousel Refs/State =====
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [slides, setSlides] = useState<HTMLImageElement[]>([]);
  const currentRef = useRef(0);

  const spacingRef = useRef(140);
  const scaleStepRef = useRef(0.16);
  const liftStepRef = useRef(10);
  const maxLayersRef = useRef(2);

  // drag / swipe
  const draggingRef = useRef(false);
  const startXRef = useRef(0);

  // chatbot popup
  const [chatOpen, setChatOpen] = useState(false);

  // collect slide elements after mount
  useEffect(() => {
    if (!stageRef.current) return;
    const imgs = Array.from(stageRef.current.querySelectorAll('img.slide')) as HTMLImageElement[];
    setSlides(imgs);
  }, []);

  const computeVars = useCallback(() => {
    if (!stageRef.current || slides.length === 0) return;
    const n = slides.length;
    const stageW = stageRef.current.clientWidth || 800;
    const slideW = slides[0]?.getBoundingClientRect().width || 220;

    // max layers depends on slide count
    maxLayersRef.current = Math.max(1, Math.min(3, Math.floor((n - 1) / 2)));

    // spacing based on stage size
    const minS = slideW * 0.5;
    const maxS = slideW * 0.78;
    const ideal = (stageW - slideW) / (maxLayersRef.current * 2.2 + 0.2);
    spacingRef.current = Math.max(minS, Math.min(maxS, ideal));

    // scale / lift step tuned to layer count
    scaleStepRef.current = 0.14 + 0.04 / Math.max(1, maxLayersRef.current);
    liftStepRef.current = Math.max(8, Math.min(12, spacingRef.current / 12));
  }, [slides]);

  const layout = useCallback(() => {
    const n = slides.length;
    if (!n) return;
    const current = currentRef.current;

    for (let i = 0; i < n; i++) {
      let d = i - current; // right +, left -
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;

      const depth = Math.abs(d);

      if (depth > maxLayersRef.current) {
        slides[i].style.opacity = '0';
        slides[i].style.transform = 'translate(-50%, calc(-50% + var(--carousel-shift)))';
        slides[i].style.zIndex = '0';
        continue;
      }

      const x = d * spacingRef.current;
      const scale = 1 - depth * scaleStepRef.current;
      const lift = -liftStepRef.current * (maxLayersRef.current - depth);

      slides[i].style.opacity = String(1 - depth * 0.12);
      slides[i].style.filter = depth ? 'blur(0.25px)' : 'none';
      slides[i].style.zIndex = String(100 - depth);
      slides[i].style.transform = `translate(calc(-50% + ${x}px), calc(-50% + var(--carousel-shift) + ${lift}px)) scale(${scale})`;
      slides[i].style.transition = 'transform .35s ease, opacity .35s ease, filter .35s ease';
    }
  }, [slides]);

  const goNext = useCallback(() => {
    if (!slides.length) return;
    currentRef.current = (currentRef.current + 1) % slides.length;
    layout();
  }, [slides, layout]);

  const goPrev = useCallback(() => {
    if (!slides.length) return;
    currentRef.current = (currentRef.current - 1 + slides.length) % slides.length;
    layout();
  }, [slides, layout]);

  // init after images loaded (to measure true sizes)
  useEffect(() => {
    if (!slides.length) return;

    const pending = slides.filter((s) => !s.complete);
    if (pending.length === 0) {
      computeVars();
      layout();
      return;
    }

    let left = pending.length;
    const onDone = () => {
      if (--left === 0) {
        computeVars();
        layout();
      }
    };
    pending.forEach((img) => {
      img.addEventListener('load', onDone, { once: true });
      img.addEventListener('error', onDone, { once: true });
    });

    return () => {
      pending.forEach((img) => {
        img.removeEventListener('load', onDone);
        img.removeEventListener('error', onDone);
      });
    };
  }, [slides, computeVars, layout]);

  // resize handler
  useEffect(() => {
    const onResize = () => {
      computeVars();
      layout();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [computeVars, layout]);

  // pointer (drag / swipe)
  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    startXRef.current = e.clientX;
    (e.target as Element)?.setPointerCapture?.(e.pointerId);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    if (dx < -30) goNext();
    else if (dx > 30) goPrev();
    draggingRef.current = false;
  };
  const onPointerCancel = () => {
    draggingRef.current = false;
  };
  const onPointerLeave = () => {
    draggingRef.current = false;
  };

  // Static data (links)
  const services = useMemo(
    () => [
      {
        href: 'https://www.si.mahidol.ac.th/e-py/',
        icon: '/image/icon_white_01.png',
        title: 'ระบบแจ้งเงินเดือน (E-PY)',
        note: 'Internet',
      },
      {
        href: 'https://www4.si.mahidol.ac.th/th/division/hr/ccal/',
        icon: '/image/cal.png',
        title: 'ระบบคำนวณเงินชดเชย',
        note: 'Internet',
      },
      {
        href: 'https://sivwork.ekoapp.com/login',
        icon: '/image/icon_white_02.png',
        title: 'ระบบขอหนังสือรับรอง Online\n(เข้าผ่าน SivWORK)',
        note: 'Internet',
      },
      {
        href: 'https://www.si.mahidol.ac.th/th/division/hr/hr_online/free_internet.html',
        icon: '/image/member.png',
        title: 'สมัครสมาชิก Free Internet',
        note: 'Internet',
      },
      {
        href:
          'https://idp.mahidol.ac.th/adfs/oauth2/authorize/?client_id=c3dd06c3-cd83-4783-a570-38232c6ce67d&response_type=code&redirect_uri=https%3A%2F%2Fmuhr.mahidol.ac.th%2Fhrconnect%2Flogin%2Flogin_adfs.php&response_mode=form_post&resource=5a49fab9-0be8-4f73-95c8-0d357d99fde9&scope=allatclaims&state=539631c1412b131c99f371a022b3f21cba92d11c73bc5dfe28246c4643dfd322',
        icon: '/image/icon_white_05.png',
        title: 'ระบบการจ้างต่อและพ้นจากงาน',
        note: 'Intranet',
      },
      {
        href:
          'https://muit.mahidol.ac.th/docs/users-guide/manual-it-membership-account/manual-it-member-acc-reset-password/',
        icon: '/image/password.png',
        title: 'กรณี ลืม Password Internet',
        note: 'Internet',
      },
    ],
    []
  );

  return (
    <main className="container">
      <title>
        หน้าหลัก
      </title>
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-content">
          <h3 className="title">คุณ สมพงษ์</h3>
          <h1 className="title">
            ฝ่ายทรัพยากรบุคคล คณะแพทยศาสตร์ศิริราชพยาบาล มหาวิทยาลัยมหิดล
          </h1>
          <p className="sub">
            "Human Resource Department, Faculty of Medicine Siriraj Hospital. Mahidol University."
          </p>

          <div className="screens" aria-hidden="true">
            {/* Large center screen */}
            <div className="screen large" data-parallax>
              <div className="bar">
                <div className="dots">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
              <div
                className="img"
                style={{ backgroundImage: `url('/image/775_3_2RMzXMB.png')` }}
              />
            </div>

            {/* Small left */}
            <div className="screen small-left" data-parallax>
              <div className="bar">
                <div className="dots">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
              <div className="img" style={{ backgroundImage: `url('/image/554_3_0.jpg')` }} />
            </div>

            {/* Small right */}
            <div className="screen small-right" data-parallax>
              <div className="bar">
                <div className="dots">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
              <div className="img" style={{ backgroundImage: `url('/image/767_3_21cRRCl.jpg')` }} />
            </div>
          </div>
        </div>
      </section>

      <h3 className="section-title">Infographic</h3>

      {/* ===== Overlapped Carousel ===== */}
      <section className="carousel-wrap" aria-label="สไลด์โปสเตอร์">
        <button className="arrow left" onClick={goPrev} aria-label="ก่อนหน้า">
          ◀
        </button>
        <button className="arrow right" onClick={goNext} aria-label="ถัดไป">
          ▶
        </button>

        <div
          className="stage"
          ref={stageRef}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onPointerLeave={onPointerLeave}
        >
          <img className="slide" src="/image/info_563_01_200.jpg" alt="โปสเตอร์ 1" />
          <img className="slide" src="/image/info_563_02_200.jpg" alt="โปสเตอร์ 2" />
          <img className="slide" src="/image/info_563_04_200.jpg" alt="โปสเตอร์ 3" />
          <img className="slide" src="/image/info_563_05_200.jpg" alt="โปสเตอร์ 4" />
          <img className="slide" src="/image/info_563_07_200.jpg" alt="โปสเตอร์ 5" />
        </div>
      </section>

      {/* ===== Frequent services ===== */}
      <h3 className="section-title">บริการที่ใช้บ่อย</h3>
      <section className="grid">
        {services.map((s) => (
          <a key={s.href} href={s.href} className="svc svc--icon" target="_blank" rel="noreferrer">
            <img className="svc-icon" src={s.icon} alt={s.title} />
            <strong>{s.title}</strong>
            <small>{s.note}</small>
          </a>
        ))}
      </section>

      {/* ===== Chatbot Poster ===== */}
      <section className="chatbot-hero">
        <div className="quote-pane">
          <span className="kicker">Smart HR Assistant</span>
          <h3 className="quote-title">“ถามได้ทุกเรื่อง HR — ตอบไว อธิบายง่าย เหมือนมีผู้ช่วยส่วนตัว”</h3>
          <p className="quote-desc">
            <strong>คุณจุ๋ม แชทบอท HR</strong> ออกแบบมาเพื่อดูแลบุคลากรทุกระดับ ให้คุณเข้าถึงข้อมูล
            กฎระเบียบ และขั้นตอนการใช้งาน <strong>ทีละขั้นตอน</strong> ไม่สับสน ไม่เสียเวลา
            และมั่นใจได้ว่าใช้งานได้ถูกต้องทุกครั้ง
          </p>
          <ul className="quote-points">
            <li>
              <strong>ตอบกลับทันใจ</strong> ตลอด 24/7
            </li>
            <li>
              <strong>อธิบายชัดเจน</strong> ทีละขั้น เข้าใจในครั้งเดียว
            </li>
            <li>
              <strong>ลดภาระงานซ้ำ ๆ</strong> ของ HR
            </li>
            <li>
              <strong>ใช้งานง่าย</strong> รองรับทุกอุปกรณ์
            </li>
          </ul>
        </div>

        <figure className="bot-poster">
          <div className="poster-frame">
            <img src="/image/205-2053605_open-work-woman-png.png" alt="Chatbot Poster" className="bot-svg" />
          </div>
          <figcaption>บอทผู้ช่วย HR • ชัดเจน • เข้าใจง่าย • พร้อมเสมอ</figcaption>
        </figure>
      </section>

      {/* ===== Chatbot FAB / Popup ===== */}
      <Link href='/chat'>
        <div
          className="chatbot-fab"
          id="chatbotFab"
          role="button"
          aria-label="คุณจุ๋ม ผู้ช่วย HR"
          // onClick={() => setChatOpen((v) => !v)}
          title="คุณจุ๋ม ผู้ช่วย HR"
        >
          🤖
        </div>
      </Link>

      {/* <div className="chatbot-popup" id="chatbotPopup" style={{ display: chatOpen ? 'flex' : 'none' }}>
        <div className="chatbot-header">
          <span>คุณจุ๋ม – ผู้ช่วย HR</span>
          <button onClick={() => setChatOpen(false)}>✕</button>
        </div>
        <div className="chatbot-body">
          <p>
            สวัสดีค่ะ 👋 ฉันคือ <strong>คุณจุ๋ม</strong> ช่วยเหลือคุณได้เสมอ
          </p>
          <p>คุณสามารถถามเรื่อง HR, การลา, สวัสดิการ ฯลฯ ได้เลย</p>
        </div>
        <div className="chatbot-footer">
          <input type="text" placeholder="พิมพ์คำถาม..." />
          <button>ส่ง</button>
        </div>
      </div> */}

      {/* ===== Styles (from your CSS, slightly tidied) ===== */}
      <style jsx global>{`
        :root {
          --hr-blue: #0c4db3;
          --ink: #111827;
          --muted: #6b7280;
          --carousel-shift: 40px;
          --icon-navy: #1f2a60;
          /* defaults that were missing in original */
          --bg-top: #f0f7ff;
          --bg-bottom: #ffffff;
          --accent: #92ffff;
        }

        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, 'TH Sarabun New', Prompt, sans-serif;
          color: var(--ink);
          background: #f7fafc;
        }
        a {
          text-decoration: none;
          color: inherit;
        }

        .container {
          max-width: 960px;
          padding: 0 24px;
          text-align: center;
          margin: 0 auto;
        }

        /* ---- HERO ---- */
        .hero {
          min-height: 100vh;
          display: grid;
          place-items: center;
          color: var(--text);
          background: linear-gradient(180deg, var(--bg-top), var(--bg-bottom));
        }
        h1.title {
          font-size: clamp(10px, 6vw, 36px);
          line-height: 1.1;
          margin: 0 0 8px;
          font-weight: 800;
          color: black;
        }
        h3.title {
          font-size: clamp(10px, 3vw, 28px);
          line-height: 1.1;
          margin: 20px 0 8px;
          font-weight: 800;
          color: black;
        }
        .sub {
          font-size: clamp(16px, 3vw, 20px);
          opacity: 0.9;
          margin: 0 0 18px;
        }
        .btn {
          display: inline-block;
          padding: 12px 18px;
          border-radius: 999px;
          background: var(--accent);
          color: #053b2b;
          background-color: rgb(146, 255, 255);
          font-weight: 800;
          border: 2px solid transparent;
        }
        .btn:active {
          transform: translateY(1px);
        }

        .screens {
          position: relative;
          max-width: 820px;
          margin: 0 auto;
        }
        .screen {
          position: relative;
          border-radius: 18px;
          background: #fff;
          border: 4px solid #e9eef7;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.28);
          overflow: hidden;
        }
        .bar {
          height: 34px;
          background: #e6effa;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
        }
        .dots {
          display: flex;
          gap: 6px;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #c2d4ef;
        }
        .img {
          aspect-ratio: 16/9;
          width: 100%;
          background: #d9e9ff center/cover no-repeat;
        }
        .screens [data-parallax] {
          will-change: transform;
          transition: transform 0.12s ease-out;
        }
        .screen.large {
          width: min(680px, 100%);
          margin: 0 auto;
          z-index: 2;
          transform: translateY(var(--py, 0)) scale(var(--scale, 1));
        }
        .screen.small-left {
          position: absolute;
          left: -30%;
          bottom: -14px;
          width: 42%;
          transform: translateY(var(--py, 0)) rotate(-6deg) scale(var(--scale, 1));
          z-index: 1;
        }
        .screen.small-right {
          position: absolute;
          right: -30%;
          bottom: -14px;
          width: 42%;
          transform: translateY(var(--py, 0)) rotate(5deg) scale(var(--scale, 1));
          z-index: 1;
        }
        @media (max-width: 960px) {
          .screen.small-left,
          .screen.small-right {
            display: none;
          }
        }

        /* ===== Carousel ===== */
        .carousel-wrap {
          position: relative;
          z-index: 0;
          margin: 20px;
          padding: 0 72px;
          background: transparent;
          border: none;
          box-shadow: none;
          isolation: isolate;
        }
        .stage {
          position: relative;
          height: 380px;
          overflow: visible;
          margin: 20px;
          margin-bottom: 50px;
          touch-action: pan-y; /* allow horizontal swipe */
          user-select: none;
        }
        .slide {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 240px;
          aspect-ratio: 2/3;
          object-fit: cover;
          border-radius: 14px;
          border: none;
          box-shadow: none;
          transform: translate(-50%, calc(-50% + var(--carousel-shift)));
          transition: transform 0.35s ease, opacity 0.35s ease, filter 0.35s ease;
        }
        @media (max-width: 960px) {
          .stage {
            height: 320px;
          }
          .slide {
            width: 200px;
          }
        }
        .arrow {
          position: absolute;
          top: calc(50% + var(--carousel-shift));
          translate: 0 -50%;
          width: 52px;
          height: 52px;
          border-radius: 999px;
          border: none;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: saturate(120%) blur(2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
          display: grid;
          place-items: center;
          cursor: pointer;
          font-size: 20px;
          z-index: 1;
        }
        .arrow:active {
          transform: scale(0.96) translateY(-50%);
        }
        .left {
          left: 14px;
        }
        .right {
          right: 14px;
        }

        /* ===== Services ===== */
        .section-title {
          font-weight: 700;
          margin: 18px 4px 10px;
          font-size: 20px;
        }
        .grid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          padding: 30px;
        }
        .svc {
          background: #0035ad;
          border-radius: 16px;
          padding: 14px;
          min-height: 110px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
          border: 1px solid #eef2f7;
          cursor: pointer;
          color: #fff;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .svc:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.18);
        }
        .svc small {
          color: #e0e7ff;
        }
        .svc--icon {
          background: var(--icon-navy);
          border-color: transparent;
          color: #fff;
          align-items: center;
          text-align: center;
          gap: 10px;
          padding-block: 18px;
        }
        .svc--icon .svc-icon {
          width: 80px;
          height: 80px;
          object-fit: contain;
          display: block;
          filter: none;
        }
        .svc--icon strong {
          font-weight: 700;
          white-space: pre-line;
        }
        .svc--icon small {
          color: #e5e8ff;
        }
        .svc--icon:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
        }

        /* ===== Chatbot Poster ===== */
        .chatbot-hero {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 28px;
          align-items: center;
          background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
          border: 1px solid #e9eef8;
          border-radius: 20px;
          padding: 28px;
          margin: 32px 0;
          box-shadow: 0 12px 28px rgba(16, 24, 40, 0.06);
        }
        .kicker {
          display: inline-block;
          padding: 6px 10px;
          border-radius: 999px;
          background: #ffc1ec;
          color: #0b5bd3;
          font-weight: 700;
          font-size: 12px;
          text-transform: uppercase;
        }
        .quote-title {
          margin: 10px 0 8px;
          font-size: 28px;
          line-height: 1.35;
          font-weight: 800;
          color: #0f172a;
          position: relative;
          padding-left: 46px;
        }
        .quote-title::before {
          content: '“';
          position: absolute;
          left: 0;
          top: -10px;
          color: #c7d2fe;
          font-size: 64px;
          font-weight: 900;
          line-height: 1;
        }
        .quote-desc {
          margin: 8px 0 14px;
          color: #334155;
          font-size: 16px;
          line-height: 1.8;
        }
        .quote-points {
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 8px;
        }
        .quote-points li {
          padding-left: 10px;
          border-left: 4px solid #22d3ee;
          font-weight: 600;
          color: #0f172a;
        }
        .bot-poster {
          margin: 0;
          text-align: center;
        }
        .poster-frame {
          width: 100%;
          height: auto;
          margin: 0 auto;
          border-radius: 22px;
          background: #fff;
          box-shadow: 0 30px 60px rgba(2, 8, 23, 0.18);
          padding: 14px;
        }
        .bot-svg {
          width: 100%;
          height: auto;
          border-radius: 14px;
        }
        .bot-poster figcaption {
          margin-top: 10px;
          color: #475569;
          font-size: 13px;
        }
        @media (max-width: 960px) {
          .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .chatbot-hero {
            grid-template-columns: 1fr;
            padding: 18px;
            gap: 16px;
          }
          .carousel-wrap {
            padding: 0 56px;
          }
        }

        /* ===== Chatbot FAB & Popup ===== */
        .chatbot-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #0c4db3;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
          z-index: 3000;
          transition: transform 0.2s ease;
        }
        .chatbot-fab:hover {
          transform: scale(1.08);
        }
        .chatbot-popup {
          position: fixed;
          bottom: 100px;
          right: 24px;
          width: 320px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
          display: none;
          flex-direction: column;
          overflow: hidden;
          z-index: 3001;
        }
        .chatbot-header {
          background: #0c4db3;
          color: #fff;
          font-weight: 600;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .chatbot-header button {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 18px;
          cursor: pointer;
        }
        .chatbot-body {
          padding: 14px;
          font-size: 14px;
          color: #111827;
          line-height: 1.5;
        }
        .chatbot-footer {
          border-top: 1px solid #eee;
          display: flex;
        }
        .chatbot-footer input {
          flex: 1;
          border: none;
          padding: 10px;
          font-size: 14px;
        }
        .chatbot-footer button {
          background: #0c4db3;
          color: #fff;
          border: none;
          padding: 0 16px;
          cursor: pointer;
        }
      `}</style>
    </main>
  );
}
