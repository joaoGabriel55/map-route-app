import { useActionState, useState } from "react";
import { GeoJSON } from "../../domain/GeoJSON";
import { useRoute } from "../../hooks/useRoute";
import { MarkerIcon } from "../../icons/MarkerIcon";
import { toastNotifier } from "../../shared/toast-notifier/ToastNotifier";
import "./RouteForm.css";

type RouteFormProps = {
  onRouteLoaded: (data: GeoJSON) => void;
};

export function RouteForm({ onRouteLoaded }: RouteFormProps) {
  const { getRoute } = useRoute();

  const [routeFormData, setRouteFormData] = useState({
    from: "",
    to: "",
  });

  const [_, submitAction, isPending] = useActionState(async () => {
    const from = routeFormData.from.split(",").map(Number) as [number, number];
    const to = routeFormData.to.split(",").map(Number) as [number, number];

    try {
      const returnValue = await getRoute(from, to);

      onRouteLoaded(returnValue);

      toastNotifier.success("Route calculated!");
    } catch (error) {
      toastNotifier.error(
        "Error calculating the route",
        <button className="button-outline" onClick={submitAction}>
          Try again
        </button>
      );
    }
  });

  const handleRouteFormChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setRouteFormData({ ...routeFormData, [name]: value });
  };

  return (
    <div className="route-form-card">
      <div className="route-path">
        <div className="from-point" />
        <div className="dash-line">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="line-point" key={index} />
          ))}
        </div>
        <MarkerIcon />
      </div>
      <form className="form" action={submitAction}>
        <section>
          <div className="input-field">
            <label htmlFor="from">From</label>
            <input
              type="text"
              name="from"
              id="from"
              value={routeFormData.from}
              required
              onChange={handleRouteFormChange}
            />
          </div>
          <div className="input-field">
            <label htmlFor="to">To</label>
            <input
              type="text"
              name="to"
              id="to"
              value={routeFormData.to}
              required
              onChange={handleRouteFormChange}
            />
          </div>
        </section>
        <button type="submit" disabled={isPending}>
          {isPending ? "Loading..." : "Get Route"}
        </button>
      </form>
    </div>
  );
}
