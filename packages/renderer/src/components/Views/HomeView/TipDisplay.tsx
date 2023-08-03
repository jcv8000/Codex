import { Alert } from "@mantine/core";
import { locales } from "common/Locales";
import { Icon } from "components/Icon";
import { useContext, useMemo } from "react";
import { AppContext } from "types/AppStore";

export function TipDisplay() {
    const { prefs } = useContext(AppContext);
    const locale = locales[prefs.general.locale];

    const tip = useMemo(() => {
        const tips = locale.home.tips;
        return tips[Math.floor(Math.random() * tips.length)];
    }, [locale.home.tips]);

    return (
        <Alert icon={<Icon icon="info-circle" />} title={locale.home.tip} maw="90%">
            {tip}
        </Alert>
    );
}
