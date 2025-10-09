"use client";
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { PatientManagement } from "@/components/PatientManagement";

export default function PatientsPage() {
  return (
    <Layout>
      <PatientManagement />
    </Layout>
  );
}
