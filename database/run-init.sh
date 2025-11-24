#!/bin/bash
echo "Waiting for SQL Server to be ready..."

# Loop until SQL Server is ready
for i in {1..60};
do
    /opt/mssql-tools18/bin/sqlcmd -C -S db -U sa -P $MSSQL_SA_PASSWORD -Q "SELECT 1" > /dev/null 2>&1
    if [ $? -eq 0 ]
    then
        echo "SQL Server is ready."
        break
    else
        echo "Not ready yet..."
        sleep 1
    fi
done

echo "Running initialization script..."
/opt/mssql-tools18/bin/sqlcmd -C -S db -U sa -P $MSSQL_SA_PASSWORD -d master -i /docker-entrypoint-initdb.d/init.sql

if [ $? -eq 0 ]
then
    echo "Initialization complete."
else
    echo "Initialization failed."
    exit 1
fi
