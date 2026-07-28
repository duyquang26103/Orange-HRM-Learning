export function EmployUniq(prefix = 'QA') {
    const runId = Date.now();

    return {
        first_Name: prefix,
        last_Name: `User${String(runId).slice(-6)}`,
        employeeId: `${prefix.charAt(0).toUpperCase()}${String(runId).slice(-8)}`
    };
}