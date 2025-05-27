"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AddRecord() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    gender: "",
    diagnosis: "",
    doctor: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Add logic to save the data to the database or API here
    router.push("/medical-record"); // Redirect to the medical records page after submission
  };

  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Tambah Rekam Medik</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Name */}
          <div>
            <label
              htmlFor="patientName"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Pasien
            </label>
            <Input
              id="patientName"
              name="patientName"
              type="text"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="Masukkan nama pasien"
              required
            />
          </div>

          {/* Age */}
          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700"
            >
              Umur
            </label>
            <Input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              placeholder="Masukkan umur pasien"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Jenis Kelamin
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Pilih jenis kelamin</option>
              <option value="Male">Laki-laki</option>
              <option value="Female">Perempuan</option>
            </select>
          </div>

          {/* Diagnosis */}
          <div>
            <label
              htmlFor="diagnosis"
              className="block text-sm font-medium text-gray-700"
            >
              Diagnosis
            </label>
            <Input
              id="diagnosis"
              name="diagnosis"
              type="text"
              value={formData.diagnosis}
              onChange={handleChange}
              placeholder="Masukkan diagnosis"
              required
            />
          </div>

          {/* Doctor */}
          <div>
            <label
              htmlFor="doctor"
              className="block text-sm font-medium text-gray-700"
            >
              Dokter
            </label>
            <Input
              id="doctor"
              name="doctor"
              type="text"
              value={formData.doctor}
              onChange={handleChange}
              placeholder="Masukkan nama dokter"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Catatan
            </label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Masukkan catatan tambahan"
            />
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Simpan Rekam Medik
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
