import { useMemo } from "react";
import { Order } from "../interfaces/Order";

export type Period = "day" | "week" | "month" | "year";

/* =========================
   DATE HELPERS
========================= */
const isInPeriod = (date: Date, period: Period) => {
  const now = new Date();

  switch (period) {
    case "day":
      return date.toDateString() === now.toDateString();

    case "week": {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return date >= weekAgo;
    }

    case "month":
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );

    case "year":
      return date.getFullYear() === now.getFullYear();

    default:
      return true;
  }
};

/* =========================
   ANALYTICS HOOK
========================= */
export const useAnalytics = (orders: Order[], period: Period) => {
  return useMemo(() => {
    /* 🔹 Filtrar por período */
    const filteredOrders = orders.filter((order) => {
      if (!order.date) return false;
      const date = order.date?.toDate ? order.date.toDate() : new Date(order.date);
      return isInPeriod(date, period);
    });

    /* 🔹 Revenue */
    const revenue = filteredOrders.reduce((sum, order) => {
      return sum + Number(order.total || 0);
    }, 0);

    /* 🔹 Orders */
    const ordersCount = filteredOrders.length;

    /* 🔹 Users únicos */
    const users = new Set(filteredOrders.map((o) => o.name)).size;

    /* 🔹 Ticket promedio */
    const ticketAvg = ordersCount ? revenue / ordersCount : 0;

    /* 🔹 Estados */
    const delivered = filteredOrders.filter(
      (o) => o.state === "completada"
    ).length;

    const cancelled = filteredOrders.filter(
      (o) => o.state === "cancelada"
    ).length;

    /* 🔹 Revenue chart */
    const revenueMap: Record<string, number> = {};

    filteredOrders.forEach((order) => {
      const date = order.date?.toDate ? order.date.toDate() : new Date(order.date);
      const dateString = date.toLocaleDateString();

      const total = Number(order.total || 0);

      revenueMap[dateString] = (revenueMap[dateString] || 0) + total;
    });

    const revenueChart = Object.entries(revenueMap).map(
      ([date, total]) => ({
        date,
        total,
      })
    );

    /* 🔹 Top productos (Cantidad y Revenue) */
    const productQtyMap: Record<string, number> = {};
    const productRevMap: Record<string, number> = {};

    filteredOrders.forEach((order) => {
      order.products?.forEach((p) => {
        productQtyMap[p.productName] = (productQtyMap[p.productName] || 0) + Number(p.quantity || 1);
        productRevMap[p.productName] = (productRevMap[p.productName] || 0) + (Number(p.quantity || 1) * Number(p.price || 0));
      });
    });

    const topProducts = Object.entries(productQtyMap)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    const topProductsByRevenue = Object.entries(productRevMap)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    /* 🔹 Métodos de Pago y Tipos de Orden */
    const paymentMethodsMap: Record<string, number> = {};
    const orderTypesMap: Record<string, number> = {};

    filteredOrders.forEach(order => {
      const pm = order.paymentMethod?.toLowerCase() || "desconocido";
      paymentMethodsMap[pm] = (paymentMethodsMap[pm] || 0) + 1;

      const ot = order.orderType || "no especificado";
      orderTypesMap[ot] = (orderTypesMap[ot] || 0) + 1;
    });

    const paymentMethods = Object.entries(paymentMethodsMap).map(([name, value]) => ({ name, value }));
    const orderTypes = Object.entries(orderTypesMap).map(([name, value]) => ({ name, value }));

    /* 🔹 Horas Pico (Peak Hours) */
    const peakHoursMap: Record<string, number> = {};

    filteredOrders.forEach(order => {
      const date = order.date?.toDate ? order.date.toDate() : new Date(order.date);
      // Agrupar por hora del día (0-23)
      const hour = date.getHours();
      // Formateo simple para display (ej: "14:00")
      const formattedHour = `${hour.toString().padStart(2, '0')}:00`;
      peakHoursMap[formattedHour] = (peakHoursMap[formattedHour] || 0) + 1;
    });

    const peakHours = Object.entries(peakHoursMap)
      .map(([time, orders]) => ({ time, orders }))
      .sort((a, b) => a.time.localeCompare(b.time));

    /* 🔹 Growth (simple baseline for UI demo) */
    const growth = ordersCount ? (delivered / ordersCount) * 100 : 0;

    return {
      revenue,
      orders: ordersCount,
      users,
      ticketAvg,
      delivered,
      cancelled,
      revenueChart,
      topProducts,
      topProductsByRevenue,
      paymentMethods,
      orderTypes,
      peakHours,
      growth,
    };
  }, [orders, period]);
};
