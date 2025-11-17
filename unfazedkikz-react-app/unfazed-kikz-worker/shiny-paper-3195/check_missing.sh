#!/bin/bash
while IFS= read -r id; do
    # Remove quotes
    id_clean=$(echo $id | tr -d "'")
    result=$(wrangler d1 execute unfazed-kikz --remote --command="SELECT id FROM shoes WHERE id = '$id_clean'" 2>/dev/null | grep -c "$id_clean")
    if [ "$result" -eq 0 ]; then
        echo "$id_clean"
    fi
done < batch_2_1_ids.txt
