import { TradeListTable } from "./components/TradeListTable";

export default function Page() {
    return (
        <>
        <h1>Trades List</h1>
        <div className="mt-4">
            <TradeListTable />
        </div>
        </>
    );
}