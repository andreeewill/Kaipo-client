"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, FileText, Pill, Download, Eye } from "lucide-react";

interface PaymentService {
  name: string;
  price: number;
  quantity: number;
}

interface PaymentMedicine {
  name: string;
  price: number;
  quantity: number;
}

interface Payment {
  id: number;
  date: string;
  treatmentDate: string;
  services: PaymentService[];
  medicines: PaymentMedicine[];
  totalAmount: number;
  paymentStatus: "Paid" | "Pending" | "Cancelled";
  paymentMethod: string;
  notes: string;
}

interface PatientPaymentProps {
  payments: Payment[];
}

export function PatientPayment({ payments }: PatientPaymentProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Paid":
        return "Lunas";
      case "Pending":
        return "Menunggu";
      case "Cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  const totalPaidAmount = payments
    .filter(payment => payment.paymentStatus === "Paid")
    .reduce((sum, payment) => sum + payment.totalAmount, 0);

  const totalPendingAmount = payments
    .filter(payment => payment.paymentStatus === "Pending")
    .reduce((sum, payment) => sum + payment.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Terbayar</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(totalPaidAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Menunggu Pembayaran</p>
                <p className="text-lg font-semibold text-yellow-600">
                  {formatCurrency(totalPendingAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Transaksi</p>
                <p className="text-lg font-semibold text-blue-600">
                  {payments.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Riwayat Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment) => (
              <Card key={payment.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className={getStatusColor(payment.paymentStatus)}>
                          {getStatusLabel(payment.paymentStatus)}
                        </Badge>
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Perawatan: {new Date(payment.treatmentDate).toLocaleDateString('id-ID')}
                        </span>
                        <span className="text-sm text-gray-600">
                          Bayar: {new Date(payment.date).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Metode:</strong> {payment.paymentMethod}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Detail
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Invoice
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Services */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Layanan Medis
                      </h4>
                      <div className="space-y-2">
                        {payment.services.map((service, index) => (
                          <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                            <div>
                              <div className="font-medium">{service.name}</div>
                              <div className="text-gray-600">Qty: {service.quantity}</div>
                            </div>
                            <div className="font-medium text-blue-600">
                              {formatCurrency(service.price * service.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Medicines */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Pill className="w-4 h-4" />
                        Obat-obatan
                      </h4>
                      {payment.medicines.length > 0 ? (
                        <div className="space-y-2">
                          {payment.medicines.map((medicine, index) => (
                            <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                              <div>
                                <div className="font-medium">{medicine.name}</div>
                                <div className="text-gray-600">Qty: {medicine.quantity}</div>
                              </div>
                              <div className="font-medium text-green-600">
                                {formatCurrency(medicine.price * medicine.quantity)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
                          Tidak ada obat yang diresepkan
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-semibold text-gray-900">
                        Total Pembayaran:
                      </div>
                      <div className="text-xl font-bold text-blue-600">
                        {formatCurrency(payment.totalAmount)}
                      </div>
                    </div>
                    {payment.notes && (
                      <div className="mt-2 text-sm text-gray-600 bg-blue-50 p-2 rounded">
                        <strong>Catatan:</strong> {payment.notes}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {payments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Riwayat Pembayaran</h3>
            <p className="text-gray-600">
              Riwayat pembayaran akan muncul setelah pasien melakukan transaksi.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
