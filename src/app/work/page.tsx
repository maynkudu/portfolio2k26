import InfiniteSlider from "@/components/common/infinite-slider";
import Title from "@/components/common/title";
import { services } from "@/lib/services";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Work | Maynkudu",
};

const WorkPage = () => {
    return (
        <div className="text-7xl min-h-[200svh]">
            <Title title="Work" variant="Slide On Scroll" />
            <div>
                <InfiniteSlider images={services} />
            </div>
        </div>
    );
};

export default WorkPage;
