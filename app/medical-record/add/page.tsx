"use client";
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { AddMedicalRecordStepper } from "@/components/AddMedicalRecordStepper";

export default function AddMedicalRecord() {
  return (
    <Layout>
      <div className="p-6">
        <AddMedicalRecordStepper />
      </div>
    </Layout>
  );
}
