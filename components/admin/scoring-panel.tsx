"use client";

import QrScanner from "qr-scanner";
import { Camera, QrCode, X } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";

import { addPointAction, registerPurchaseAction, type ScoringState } from "@/app/admin/scoring/actions";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { calculatePointsFromAmount } from "@/lib/loyalty/points";
import { cn } from "@/lib/utils";
import type { CustomerSnapshot } from "@/lib/types/domain";

const initialState: ScoringState = {};

export function ScoringPanel({
  customer,
  businessId
}: {
  customer: CustomerSnapshot;
  businessId: string;
}) {
  const [state, formAction, isPending] = useActionState(addPointAction, initialState);
  const [purchaseState, purchaseFormAction, purchasePending] = useActionState(registerPurchaseAction, initialState);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [scannedCustomer, setScannedCustomer] = useState<CustomerSnapshot | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [amount, setAmount] = useState("0");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    if (!isScannerOpen || !videoRef.current) {
      return;
    }

    const scanner = new QrScanner(
      videoRef.current,
      async (result) => {
        scanner.stop();
        setIsScannerOpen(false);

        try {
          const response = await fetch(
            `/api/admin/scoring/resolve-qr?businessId=${encodeURIComponent(businessId)}&token=${encodeURIComponent(result.data)}`
          );
          const payload = await response.json();

          if (!response.ok) {
            setScannerError(payload.error ?? "No hemos podido leer este QR.");
            return;
          }

          setScannerError(null);
          setScannedCustomer(payload.customer);
          setAmount("0");
          setIsPurchaseModalOpen(true);
        } catch {
          setScannerError("No hemos podido procesar el QR escaneado.");
        }
      },
      {
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true
      }
    );

    scannerRef.current = scanner;

    scanner.start().catch(() => {
      setScannerError("No hemos podido acceder a la camara. Revisa permisos del navegador.");
      setIsScannerOpen(false);
    });

    return () => {
      scanner.stop();
      scanner.destroy();
      scannerRef.current = null;
    };
  }, [businessId, isScannerOpen]);

  useEffect(() => {
    if (purchaseState.success) {
      setIsPurchaseModalOpen(false);
      setScannedCustomer(null);
      setAmount("0");
    }
  }, [purchaseState.success]);

  const computedPoints = calculatePointsFromAmount(Number(amount || 0));

  return (
    <>
      <div className="card-surface p-6">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Button onClick={() => setIsScannerOpen(true)} type="button" variant="secondary">
            <Camera className="mr-2 h-4 w-4" />
            Leer QR
          </Button>
          <p className="text-sm text-muted">Escanea el QR del cliente y registra la compra a partir del importe.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <form action={formAction}>
            <input name="userId" type="hidden" value={customer.id} />
            <input name="businessId" type="hidden" value={businessId} />
            <input name="pointsDelta" type="hidden" value="1" />
            <input name="note" type="hidden" value="Punto rapido desde puntuador" />
            <Button disabled={isPending}>+1 punto</Button>
          </form>
          <form action={formAction}>
            <input name="userId" type="hidden" value={customer.id} />
            <input name="businessId" type="hidden" value={businessId} />
            <input name="pointsDelta" type="hidden" value="5" />
            <input name="note" type="hidden" value="Carga rapida de 5 puntos" />
            <Button disabled={isPending} variant="secondary">+5 puntos</Button>
          </form>
          <form action={formAction}>
            <input name="userId" type="hidden" value={customer.id} />
            <input name="businessId" type="hidden" value={businessId} />
            <input name="pointsDelta" type="hidden" value="-5" />
            <input name="note" type="hidden" value="Ajuste manual de -5 puntos" />
            <Button disabled={isPending} variant="secondary">Ajuste -5</Button>
          </form>
          <form action={formAction}>
            <input name="userId" type="hidden" value={customer.id} />
            <input name="businessId" type="hidden" value={businessId} />
            <input name="pointsDelta" type="hidden" value="10" />
            <input name="note" type="hidden" value="Bonus manual de 10 puntos" />
            <Button disabled={isPending} variant="secondary">Bonus +10</Button>
          </form>
        </div>
        <form action={formAction} className="mt-5 grid gap-3 md:grid-cols-[1fr_160px_auto]">
          <input name="userId" type="hidden" value={customer.id} />
          <input name="businessId" type="hidden" value={businessId} />
          <Input defaultValue="Ajuste manual desde puntuador" name="note" />
          <Input defaultValue="1" name="pointsDelta" type="number" />
          <Button disabled={isPending} variant="secondary">
            Aplicar custom
          </Button>
        </form>
        {state.error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p> : null}
        {state.success ? <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Movimiento registrado.</p> : null}
        {scannerError ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{scannerError}</p> : null}
        <div className="mt-6 rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
          Cada acción registra `point_transactions` y `audit_logs`, y actualiza `business_memberships`.
        </div>
      </div>

      {isScannerOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-5 shadow-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted">Lector QR</p>
                <h2 className="text-xl font-semibold">Escanea el perfil del cliente</h2>
              </div>
              <button
                className="rounded-full border border-line p-2 text-slate-500"
                onClick={() => setIsScannerOpen(false)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 overflow-hidden rounded-[24px] bg-black">
              <video className="aspect-square w-full object-cover" ref={videoRef} />
            </div>
            <p className="mt-3 text-sm text-muted">Apunta a un QR generado desde el perfil del cliente.</p>
          </div>
        </div>
      ) : null}

      {isPurchaseModalOpen && scannedCustomer ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted">Compra escaneada</p>
                <h2 className="text-xl font-semibold">{scannedCustomer.firstName} {scannedCustomer.lastName}</h2>
                <p className="mt-1 text-sm text-muted">{scannedCustomer.email}</p>
              </div>
              <button
                className="rounded-full border border-line p-2 text-slate-500"
                onClick={() => setIsPurchaseModalOpen(false)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form action={purchaseFormAction} className="mt-5 space-y-4">
              <input name="userId" type="hidden" value={scannedCustomer.id} />
              <input name="businessId" type="hidden" value={businessId} />
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-muted">Saldo actual</p>
                <p className="mt-1 text-lg font-semibold">{scannedCustomer.totalPoints} puntos</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Importe</label>
                <Input
                  min="0"
                  name="amount"
                  onChange={(event) => setAmount(event.currentTarget.value)}
                  step="0.01"
                  type="number"
                  value={amount}
                />
              </div>
              <div className={cn("rounded-2xl px-4 py-3 text-sm", computedPoints > 0 ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-muted")}>
                {computedPoints > 0 ? `Se sumarán ${computedPoints} puntos automáticamente.` : "Introduce un importe superior a 0 para calcular puntos."}
              </div>
              {purchaseState.error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{purchaseState.error}</p> : null}
              <div className="flex flex-wrap gap-3">
                <Button disabled={purchasePending || computedPoints <= 0}>
                  <QrCode className="mr-2 h-4 w-4" />
                  {purchasePending ? "Registrando..." : "Registrar compra"}
                </Button>
                <Button onClick={() => setIsPurchaseModalOpen(false)} type="button" variant="secondary">
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
