import os
import sys
import traceback
from fastapi.testclient import TestClient

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.core.database import Base, get_db
from app.main import app
from tests.unit.test_business_rules import (
    test_pricing_commission_15_percent,
    test_pricing_trajet_confort_30_percent,
    test_midpoint_break_over_300km_threshold,
    test_fuel_estimate_and_missing_data_resilience,
    test_pricing_validation_errors,
)
from tests.integration.test_api_endpoints import (
    test_auth_and_trip_creation_flow,
    test_booking_approval_and_capacity_concurrency,
    test_chat_authorization_security,
)


def run_all_tests():
    print("=" * 70)
    print("  DZ-CARPOOL — SUITE DE TESTS AUTOMATISÉE (UNITAIRES & INTÉGRATION)")
    print("=" * 70)

    unit_tests = [
        ("test_pricing_commission_15_percent", test_pricing_commission_15_percent),
        ("test_pricing_trajet_confort_30_percent", test_pricing_trajet_confort_30_percent),
        ("test_midpoint_break_over_300km_threshold", test_midpoint_break_over_300km_threshold),
        ("test_fuel_estimate_and_missing_data_resilience", test_fuel_estimate_and_missing_data_resilience),
        ("test_pricing_validation_errors", test_pricing_validation_errors),
    ]

    passed = 0
    failed = 0

    print("\n--- 1. TESTS UNITAIRES (RÈGLES MÉTIER DZ-CARPOOL) ---")
    for name, test_fn in unit_tests:
        try:
            test_fn()
            print(f"  [PASS] {name}")
            passed += 1
        except Exception as e:
            print(f"  [FAIL] {name}: {e}")
            traceback.print_exc()
            failed += 1

    integration_tests = [
        ("test_auth_and_trip_creation_flow", test_auth_and_trip_creation_flow),
        ("test_booking_approval_and_capacity_concurrency", test_booking_approval_and_capacity_concurrency),
        ("test_chat_authorization_security", test_chat_authorization_security),
    ]

    print("\n--- 2. TESTS D'INTÉGRATION (API REST & BASE DE DONNÉES) ---")
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker

    test_db_file = "/tmp/dz_carpool_test_runner.db"

    for name, test_fn in integration_tests:
        if os.path.exists(test_db_file):
            try:
                os.remove(test_db_file)
            except OSError:
                pass

        runner_engine = create_engine(f"sqlite:///{test_db_file}", connect_args={"check_same_thread": False})
        RunnerSession = sessionmaker(autocommit=False, autoflush=False, bind=runner_engine)
        Base.metadata.create_all(bind=runner_engine)

        def override_db():
            s = RunnerSession()
            try:
                yield s
            finally:
                s.close()

        app.dependency_overrides[get_db] = override_db

        try:
            with TestClient(app) as test_client:
                test_fn(test_client)
            print(f"  [PASS] {name}")
            passed += 1
        except Exception as e:
            print(f"  [FAIL] {name}: {e}")
            traceback.print_exc()
            failed += 1
        finally:
            app.dependency_overrides.clear()
            Base.metadata.drop_all(bind=runner_engine)
            runner_engine.dispose()
            if os.path.exists(test_db_file):
                try:
                    os.remove(test_db_file)
                except OSError:
                    pass

    print("\n" + "=" * 70)
    print(f"RÉSULTAT: {passed} RÉUSSIS, {failed} ÉCHOUÉS (TOTAL: {passed + failed})")
    print("=" * 70)

    if failed > 0:
        sys.exit(1)


if __name__ == "__main__":
    run_all_tests()
