
try:
    print("Importing sqlmodel...")
    import sqlmodel
    print("Success!")
except Exception as e:
    print(f"Failed: {e}")
    import traceback
    traceback.print_exc()
