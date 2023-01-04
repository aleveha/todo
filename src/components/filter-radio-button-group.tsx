import { Filter } from "@states/userState";
import { FC } from "react";

interface FilterVariant {
	id: Filter;
	label: string;
}

const FILTER_VARIANTS: FilterVariant[] = [
	{
		id: Filter.all,
		label: "All",
	},
	{
		id: Filter.completed,
		label: "Completed",
	},
	{
		id: Filter.incompleted,
		label: "Incompleted",
	},
];

interface Props {
	handleFilterChange: (value: Filter) => () => void;
	state: Filter;
}

export const FilterRadioButtonGroup: FC<Props> = ({ handleFilterChange, state }) => (
	<div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-4">
		{FILTER_VARIANTS.map(filterVariant => (
			<div key={filterVariant.id} className="flex items-center">
				<input
					id={filterVariant.id.toString()}
					name="notification-method"
					type="radio"
					defaultChecked={filterVariant.id === state}
					className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
					onClick={handleFilterChange(filterVariant.id)}
				/>
				<label htmlFor={filterVariant.id.toString()} className="ml-3 block text-sm font-medium text-gray-700">
					{filterVariant.label}
				</label>
			</div>
		))}
	</div>
);
