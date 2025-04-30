"use client";
import { Layout } from "@/components/layout/Layout";
import { useState } from "react";

const components = {
  "Jadwal Pasien": <div>Jadwal Pasien Content</div>,
  Calendar: <div>Calendar Content</div>,
  "Riwayat Pasien": <div>Riwayat Pasien Content</div>,
  "Rekam Medis": <div>Rekam Medis Content</div>,
};

export default function Dashboard() {
  const [selected] = useState("Jadwal Pasien");

  return (
    <Layout>
      <div>
        <h1>{selected}</h1>
        {components[selected]}
      </div>
    </Layout>
  );
}
